import { BsCircle } from "react-icons/bs"
import { PiCameraRotateBold } from "react-icons/pi"

export default function RoteteButton({ rotateCamera }) {
  return (
    <>
      <div className={`absolute flex flex-col items-start justify-start rounded-xl z-50 p-14`}>
        <div className={`z-40 text-center mb-5 text-white animate-pulse-2s cursor-pointer`} onClick={rotateCamera}>
          <PiCameraRotateBold className="text-5xl sm:text-6xl" />
        </div>
      </div>
    </>
  )
}