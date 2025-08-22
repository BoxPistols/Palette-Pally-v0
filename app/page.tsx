'use client'

import type React from 'react'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { AdvancedColorPicker } from '@/components/advanced-color-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
    generateColorVariations,
    adjustColorInOklab,
    generateGreyScale10,
    generateGreyScaleWithAdjustments,
    adjustGreyScaleColor,
} from '@/lib/color-utils'
import { ColorDisplay } from '@/components/color-display'
import { ExportImportPanel } from '@/components/export-import-panel'
import { Logo } from '@/components/logo'
import { HelpModal } from '@/components/help-modal'
import { toast } from '@/components/ui/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { TextColorSettings } from '@/components/color-setting/text-color-settings'
import { ColorVariationControls } from '@/components/color-setting/color-variation-controls'
import type {
    PaletteType,
    ColorData,
    TextColorSettings as TextColorSettingsType,
    ColorVariationSettings,
    GreyScaleColor,
    GreyScalePalette,
} from '@/types/palette'
import { defaultVariationSettings } from '@/types/palette'
import { useLanguage } from '@/lib/language-context'
import { LanguageToggle } from '@/components/language-toggle'
import { ThemeToggle } from '@/components/ui/theme-toggle'

const MAX_COLORS = 24
const STORAGE_KEY = 'palette-pally-data'
const DEFAULT_COLOR_COUNT = 6

// デザインシステムの標準カラー定義
const colorSchemes = [
    { name: "primary", value: "#42a5f5" },    // MUIのデフォルトプライマリ
    { name: "secondary", value: "#3f495c" },  // MUIのデフォルトセカンダリ
    { name: "success", value: "#2e9733" },    // 緑 - 成功状態
    { name: "warning", value: "#ff9800" },    // オレンジ - 警告状態
    { name: "error", value: "#ef5350" },      // 赤 - エラー状態
    { name: "info", value: "#03a9f4" },       // 水色 - 情報状態
]


export default function Home() {
    // カラー数の初期値
    const [colorCount, setColorCount] = useState<number>(DEFAULT_COLOR_COUNT)
    // 初期状態では空の配列に設定（ハイドレーションエラー回避のため）
    const [colorData, setColorData] = useState<ColorData[]>([])
    const [colorVariations, setColorVariations] = useState<
        Record<string, Record<string, string>>
    >({})
    const [textColorSettings, setTextColorSettings] =
        useState<TextColorSettingsType>({
            main: 'default',
            dark: 'default',
            light: 'default',
            lighter: 'default',
        })
    const [variationSettings, setVariationSettings] =
        useState<ColorVariationSettings>(defaultVariationSettings)
    
    // グレースケール調整用の状態
    const [greyScaleAdjustments, setGreyScaleAdjustments] = useState<Record<string, number>>({});

    // greyScaleはuseMemoで計算
    const greyScale = useMemo(() => generateGreyScaleWithAdjustments(greyScaleAdjustments), [greyScaleAdjustments])

    // Toast表示のデバウンス用の状態
    const [toastTimeout, setToastTimeout] = useState<NodeJS.Timeout | null>(
        null
    )
    const [lastToastTime, setLastToastTime] = useState<number>(0)

    // クライアントサイドのみでレンダリングする制御用
    const [isClient, setIsClient] = useState(false)

    const { language } = useLanguage()

    // クライアントサイドでのレンダリングフラグを設定
    useEffect(() => {
        setIsClient(true)
    }, [])

    // デバウンス付きToast表示関数
    const showDebounceToast = (
        title: string,
        description: string,
        variant?: 'default' | 'destructive'
    ) => {
        const now = Date.now()

        // 前回のToastから1秒以上経過しているか確認
        if (now - lastToastTime > 1000) {
            // 既存のタイマーをクリア
            if (toastTimeout) {
                clearTimeout(toastTimeout)
            }

            // 遅延して表示（300ms後）
            const newTimeout = setTimeout(() => {
                toast({
                    title,
                    description,
                    ...(variant && { intent: variant }),
                    // Toastのカスタムスタイル
                    className: 'toast-small',
                })
                setLastToastTime(Date.now())
            }, 300)

            setToastTimeout(newTimeout)
        }
    }

    // 初期カラーデータ作成関数
    const createInitialColorData = (count: number) => {
        const initialColors = [...colorSchemes]
        // 足りない分をランダムカラーで埋める
        if (count > colorSchemes.length) {
            for (let i = colorSchemes.length; i < count; i++) {
                const randomColor = `#${Math.floor(Math.random() * 16777215)
                    .toString(16)
                    .padStart(6, '0')}`
                initialColors.push({
                    name: `color${i + 1}`,
                    value: randomColor,
                })
            }
        }
        return initialColors.slice(0, count)
    }

    // クライアントサイドでのみ初期化を行う
    useEffect(() => {
        // ローカルストレージからデータをロード
        const savedData = localStorage.getItem(STORAGE_KEY)
        if (savedData) {
            try {
                const parsedData = JSON.parse(savedData) as PaletteType
                if (parsedData.colors && Array.isArray(parsedData.colors)) {
                    setColorData(parsedData.colors)
                    setColorCount(parsedData.colors.length)
                }

                // Load text color settings if available
                if (parsedData.textColorSettings) {
                    setTextColorSettings(parsedData.textColorSettings)
                }

                // Import variation settings if available
                if (parsedData.variationSettings) {
                    setVariationSettings(parsedData.variationSettings)
                } else {
                    // 必ず初期値を設定
                    setVariationSettings(defaultVariationSettings)
                }
                
                // Import grey scale adjustments if available
                if (parsedData.greyScale) {
                    const adjustments: Record<string, number> = {};
                    parsedData.greyScale.forEach(color => {
                        adjustments[color.id] = color.lightnessAdjustment;
                    });
                    setGreyScaleAdjustments(adjustments);
                }
            } catch (error) {
                console.error('Error loading data from localStorage:', error)
                // エラー時は初期値を確実にセット
                setColorData(createInitialColorData(colorCount))
                setVariationSettings(defaultVariationSettings)
            }
        } else {
            // 保存データがない場合は初期カラーとデフォルト設定を設定
            setColorData(createInitialColorData(colorCount))
            setVariationSettings(defaultVariationSettings)
        }
        // setGreyScaleは不要
    }, [colorCount]) // greyScaleAdjustmentsは依存配列から削除

    // カスタムバリエーション生成関数
    const generateCustomVariations = useCallback(
        (baseColor: string) => {
            if (variationSettings.usePerceptualModel) {
                // 全体の彩度調整係数 - 全てのカラーバリエーションに適用
                const baseChromaFactor = variationSettings.chromaReduction

                return {
                    // main: 基本色に彩度調整を適用（mainChroma は相対乗数）
                    main: adjustColorInOklab(baseColor, {
                        chromaDelta:
                            baseChromaFactor * variationSettings.mainChroma,
                    }),

                    // dark: 暗くしつつ彩度も調整（暗い色は視認性のため若干彩度を高めに）
                    dark: adjustColorInOklab(baseColor, {
                        lightnessDelta: variationSettings.darkDelta,
                        chromaDelta: baseChromaFactor * 1.05, // 暗い色は彩度をやや強調
                    }),

                    // light: 明るくしつつ彩度も調整
                    light: adjustColorInOklab(baseColor, {
                        lightnessDelta: variationSettings.lightDelta,
                        chromaDelta: baseChromaFactor,
                    }),

                    // lighter: より明るくしつつ彩度をさらに抑制
                    lighter: adjustColorInOklab(baseColor, {
                        lightnessDelta: variationSettings.lighterDelta,
                        chromaDelta: baseChromaFactor * 0.7, // 明るい色は彩度をより抑える
                    }),
                }
            } else {
                // 従来の方法（互換性のため）
                return generateColorVariations(baseColor)
            }
        },
        [variationSettings]
    )

    // Generate color variations when colors change
    useEffect(() => {
        if (colorData.length === 0) return

        const variations: Record<string, Record<string, string>> = {}

        colorData.forEach((color) => {
            variations[color.name] = generateCustomVariations(color.value)
        })

        setColorVariations(variations)
    }, [colorData, variationSettings, generateCustomVariations])

    // Save to localStorage function
    const saveToLocalStorage = (showToast = true) => {
        try {
            const dataToSave: PaletteType = {
                colors: colorData,
                variations: colorVariations,
                textColorSettings: textColorSettings,
                variationSettings: variationSettings,
                greyScale: greyScale, // グレースケールデータを保存
            }
            localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave))

            // showToastフラグがtrueの場合のみToastを表示
            if (showToast) {
                const title = language === 'ja' ? '保存完了' : 'Saved'
                const description =
                    language === 'ja'
                        ? 'パレットデータをLocalStorageに保存しました'
                        : 'Palette data saved to LocalStorage'
                showDebounceToast(title, description)
            }
        } catch (error) {
            console.error('Error saving to localStorage:', error)
            const title = language === 'ja' ? '保存エラー' : 'Save Error'
            const description =
                language === 'ja'
                    ? 'データの保存中にエラーが発生しました'
                    : 'An error occurred while saving data'
            showDebounceToast(title, description, 'destructive')
        }
    }

    const handleColorChange = (index: number, value: string) => {
        const newColorData = [...colorData]
        newColorData[index] = { ...newColorData[index], value }
        setColorData(newColorData)
    }

    const handleNameChange = (index: number, name: string) => {
        const newColorData = [...colorData]
        newColorData[index] = { ...newColorData[index], name }
        setColorData(newColorData)
    }

    const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const count = Number.parseInt(e.target.value)
        if (count > 0 && count <= MAX_COLORS) {
            setColorCount(count)

            // Adjust colors array length
            if (count > colorData.length) {
                // Add more colors
                const newColorData = [...colorData]
                for (let i = colorData.length; i < count; i++) {
                    const randomColor = `#${Math.floor(Math.random() * 16777215)
                        .toString(16)
                        .padStart(6, '0')}`
                    newColorData.push({
                        name: `color${i + 1}`,
                        value: randomColor,
                    })
                }
                setColorData(newColorData)
            } else if (count < colorData.length) {
                // Remove excess colors
                setColorData(colorData.slice(0, count))
            }
        }
    }

    const resetColors = () => {
        // Clear localStorage
        localStorage.removeItem(STORAGE_KEY)

        // リセット時は常に8色に戻す
        const defaultColorCount = DEFAULT_COLOR_COUNT
        setColorCount(defaultColorCount)

        // デフォルトのカラーデータを作成して設定
        const newColorData = createInitialColorData(defaultColorCount)
        setColorData(newColorData)

        // Reset text color settings
        setTextColorSettings({
            main: 'default',
            dark: 'default',
            light: 'default',
            lighter: 'default',
        })

        // Reset variation settings
        setVariationSettings(defaultVariationSettings)
        
        // Reset grey scale adjustments
        setGreyScaleAdjustments({})

        const title = language === 'ja' ? 'リセット完了' : 'Reset Complete'
        const description =
            language === 'ja'
                ? 'パレットデータをリセットしました'
                : 'Palette data has been reset'
        showDebounceToast(title, description)
    }

    const exportData: PaletteType = {
        colors: colorData,
        variations: colorVariations,
        textColorSettings: textColorSettings,
        variationSettings: variationSettings,
        greyScale: greyScale, // グレースケールデータを追加
    }

    const handleImport = (importedData: PaletteType) => {
        try {
            if (importedData.colors && Array.isArray(importedData.colors)) {
                // Validate each color entry
                const validColors = importedData.colors.filter(
                    (color) =>
                        color &&
                        typeof color === 'object' &&
                        'name' in color &&
                        'value' in color &&
                        typeof color.name === 'string' &&
                        typeof color.value === 'string' &&
                        /^#[0-9A-F]{6}$/i.test(color.value)
                )

                if (validColors.length > 0) {
                    setColorData(validColors)
                    setColorCount(validColors.length)

                    // Import text color settings if available
                    if (importedData.textColorSettings) {
                        setTextColorSettings(importedData.textColorSettings)
                    }

                    // Import variation settings if available
                    if (importedData.variationSettings) {
                        setVariationSettings(importedData.variationSettings)
                    }
                    
                    // Import grey scale adjustments if available
                    if (importedData.greyScale && Array.isArray(importedData.greyScale)) {
                        // グレースケールの調整値を抽出
                        const adjustments: Record<string, number> = {};
                        importedData.greyScale.forEach(color => {
                            if (color && typeof color === 'object' && 'id' in color && 'lightnessAdjustment' in color) {
                                adjustments[color.id] = color.lightnessAdjustment;
                            }
                        });
                        // グレースケール調整値を設定
                        if (Object.keys(adjustments).length > 0) {
                            setGreyScaleAdjustments(adjustments);
                        }
                    }

                    const message =
                        language === 'ja'
                            ? `${validColors.length}色のパレットをインポートしました`
                            : `Imported a palette with ${validColors.length} colors`
                    showDebounceToast(
                        language === 'ja'
                            ? 'インポート完了'
                            : 'Import Complete',
                        message
                    )

                    // Save to localStorage immediately after import
                    saveToLocalStorage(false)
                } else {
                    throw new Error(
                        language === 'ja'
                            ? '有効なカラーデータがありません'
                            : 'No valid color data found'
                    )
                }
            } else {
                throw new Error(
                    language === 'ja'
                        ? 'カラーデータが見つかりません'
                        : 'Color data not found'
                )
            }
        } catch (error) {
            console.error('Import error:', error)
            showDebounceToast(
                language === 'ja' ? 'インポートエラー' : 'Import Error',
                error instanceof Error
                    ? error.message
                    : language === 'ja'
                        ? '不明なエラーが発生しました'
                        : 'An unknown error occurred',
                'destructive'
            )
        }
    }

    const handleTextColorSettingsChange = (
        newSettings: TextColorSettingsType
    ) => {
        setTextColorSettings(newSettings)
        // 即時保存するが、Toastは表示しない
        saveToLocalStorage(false)
    }

    const handleVariationSettingsChange = (
        newSettings: ColorVariationSettings
    ) => {
        setVariationSettings(newSettings)
        // 即時保存するが、Toastは表示しない
        saveToLocalStorage(false)
    }

    // グレースケールだけをリセットする関数
    const resetGreyScaleOnly = () => {
        // グレースケール調整値をリセット
        setGreyScaleAdjustments({});
        
        // 保存して小さいToastを表示
        saveToLocalStorage(false);
        
        const title = language === 'ja' ? 'グレースケールリセット完了' : 'Greyscale Reset';
        const description = language === 'ja' 
            ? 'グレースケールをデフォルト値にリセットしました' 
            : 'Greyscale values have been reset to default';
        showDebounceToast(title, description);
    };

    // グレースケールカラーの明暗調整値を変更するハンドラー
    const handleGreyScaleAdjustment = (id: string, value: number) => {
        // 調整値の範囲を-100〜100に制限
        const adjustedValue = Math.max(-100, Math.min(100, value));
        // グレースケール調整値を更新
        const newAdjustments = { ...greyScaleAdjustments, [id]: adjustedValue };
        setGreyScaleAdjustments(newAdjustments);
        // setGreyScaleは呼ばない
        // 即時保存（Toastは表示しない）
        saveToLocalStorage(false);
    };

    // 保存ボタン用ハンドラ（明示的な保存アクション）
    const handleSaveButtonClick = () => {
        // 保存してToastを必ず表示
        saveToLocalStorage(true)
    }

    // クライアントサイドレンダリングが完了するまでは最小限の内容だけ表示
    if (!isClient || colorData.length === 0) {
        return <div className='container mx-auto px-6 py-6'>Loading...</div>
    }

    return (
        <main className='container mx-auto sm:px-4 lg:px-6 py-2 max-w-screen-2xl'>
            <Card className='mb-5'>
                <CardHeader className='py-3 px-4'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center flex-col sm:flex-row sm:items-center sm:gap-2'>
                            <Logo />
                        </div>
                        <div className='flex items-center gap-2'>
                            <div className='flex items-center gap-2'>
                                <label
                                    htmlFor='colorCount'
                                    className='text-sm font-medium whitespace-nowrap'
                                >
                                    {language === 'ja'
                                        ? 'カラー数:'
                                        : 'Colors:'}
                                </label>
                                <Input
                                    id='colorCount'
                                    type='number'
                                    min='1'
                                    max={MAX_COLORS}
                                    value={colorCount}
                                    onChange={handleCountChange}
                                    style={{
                                        fontSize: '1.05em',
                                    }}
                                />
                            </div>
                            <button
                                onClick={resetColors}
                                className='text-sm font-medium dark:text-white border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700'
                            >
                                {language === 'ja' ? 'リセット' : 'Reset'}
                            </button>
                            <button
                                className='text-sm font-medium dark:text-white border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-700'
                                onClick={handleSaveButtonClick}
                            >
                                {language === 'ja' ? '保存' : 'Save'}
                            </button>
                            <LanguageToggle />
                            <HelpModal />
                            <ThemeToggle />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='px-4 py-3'>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                        <ExportImportPanel
                            data={exportData}
                            onImport={handleImport}
                        />
                        <TextColorSettings
                            settings={textColorSettings}
                            onChange={handleTextColorSettingsChange}
                        />
                        <ColorVariationControls
                            settings={variationSettings}
                            onChange={handleVariationSettingsChange}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className='grid grid-cols-1 xl:grid-cols-2 gap-6'>
                {/* Color Pickers Section */}
                <div>
                    <h2 className='text-lg font-semibold mb-3'>
                        {language === 'ja' ? 'カラーピッカー' : 'Color Picker'}
                    </h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3'>
                        {colorData.map((color, index) => (
                            <AdvancedColorPicker
                                key={index}
                                index={index}
                                name={color.name}
                                color={color.value}
                                onColorChange={(value) =>
                                    handleColorChange(index, value)
                                }
                                onNameChange={(name) =>
                                    handleNameChange(index, name)
                                }
                            />
                        ))}
                    </div>
                </div>

                {/* Color Palette Section */}
                <div>
                    <h2 className='text-lg font-semibold mb-3'>
                        {language === 'ja' ? 'カラーパレット' : 'Color Palette'}
                    </h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3'>
                        {Object.entries(colorVariations).map(
                            ([key, variations], index) => (
                                <ColorDisplay
                                    key={key}
                                    colorKey={key}
                                    variations={variations}
                                    textColorSettings={textColorSettings}
                                />
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* グレースケール表示セクション */}
            <Card className='mt-6'>
                <CardHeader className='py-3 px-4'>
                    <h2 className='text-lg font-semibold'>
                        {language === 'ja' ? 'グレースケール (Example)' : 'Greyscale (MUI-like)'}
                    </h2>
                </CardHeader>
                <CardContent className='px-4 py-3'>
                    <div className='grid grid-cols-5 sm:grid-cols-10 gap-3'>
                        {greyScale.map((colorItem, index) => {
                            // MUIのカラースキーマに合わせたラベル
                            const labelMap = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"];
                            const label = labelMap[index];
                            
                            return (
                                <div key={`grey-${label}`} className='flex flex-col items-center p-2 rounded-lg shadow-md bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow'>
                                    <div
                                        style={{ backgroundColor: colorItem.adjustedHex }}
                                        className='w-full h-16 rounded-md mb-2 border border-gray-300 dark:border-gray-600 shadow-inner'
                                    />
                                    <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                        {label}
                                    </span>
                                    <span className='text-xs text-gray-500 dark:text-gray-400'>
                                        {colorItem.adjustedHex}
                                    </span>
                                    
                                    {/* 明暗調整スライダー */}
                                    <div className='w-full mt-2 px-1'>
                                        <input
                                            type="range"
                                            min="-100"
                                            max="100"
                                            value={colorItem.lightnessAdjustment}
                                            onChange={(e) => handleGreyScaleAdjustment(
                                                colorItem.id, 
                                                parseInt(e.target.value)
                                            )}
                                            className='w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700'
                                        />
                                        <div className='flex justify-between text-xs text-gray-500 mt-1'>
                                            <span>-</span>
                                            <span>{colorItem.lightnessAdjustment}</span>
                                            <span>+</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
                <CardContent className='border-t pt-3 px-4 flex justify-end'>
                    <Button
                        onClick={resetGreyScaleOnly}
                        variant='outline'
                        size='sm'
                        className='text-sm'
                    >
                        {language === 'ja' ? 'グレースケールリセット' : 'Reset Greyscale'}
                    </Button>
                </CardContent>
            </Card>

            <Toaster />
        </main>
    )
}

function saveToStorage(arg0: boolean) {
    throw new Error('Function not implemented.')
}
