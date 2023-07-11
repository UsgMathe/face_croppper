import { BsCircle } from "react-icons/bs"

export default function PhotoButton({ takePhoto }) {
  return (
    <>
      <div className={`absolute flex flex-col items-center justify-end w-full h-full rounded-xl z-50`}>
        <div className={`mb-10 z-50 text-center text-white animate-pulse-2s cursor-pointer`} onClick={takePhoto}>
          <BsCircle className="text-7xl sm:text-8xl opacity-75" />
        </div>
      </div>
    </>
  )
}