import { BsExclamationCircle as InfoIcon } from 'react-icons/bs'

export default function PopupMessage({ className, condition, children, error }) {
  return (
    <>
      <div className=" absolute flex items-start w-full h-full rounded-xl z-40 ">
        <div className={`${className} ${condition ? 'translate-y-0' : '-translate-y-[300%]'} flex items-center justify-center gap-4 z-50 w-full text-center text-white py-2 rounded-t-xl transition-all duration-700 ${error ? 'bg-pormade-red/70' : 'bg-usgmathe/70'}`}>
          <InfoIcon className={`text-white text-2xl transition-all`} />
          <p className="text-2xl font-medium">{children}</p>
        </div>
      </div>
    </>
  )
}