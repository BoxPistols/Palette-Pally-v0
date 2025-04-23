export function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex">
        <div className="w-4 h-4 bg-red-500 rounded-full" />
        <div className="w-4 h-4 bg-green-500 rounded-full -ml-1" />
        <div className="w-4 h-4 bg-blue-500 rounded-full -ml-1" />
        <div className="w-4 h-4 bg-purple-500 rounded-full -ml-1" />
      </div>
      <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
        Palette Pally
      </h1>
    </div>
  )
}
