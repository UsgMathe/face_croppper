
export default function NavigationButton({ className, disabled, onClick, children, icon, reverse = false }) {
  return (
    <button className={`${className} flex ${reverse && 'flex-row-reverse'} items-center  gap-2 hover:scale-95 transition-all duration-300`} disabled={disabled} onClick={onClick}>
      <p className="text-xl font-semibold  ">
        {children}
      </p>
      <p className={`text-5xl ${disabled ? 'text-input-text' : 'text-white sm:text-usgmathe'} drop-shadow-lg shadow-black`}>
        {icon}
      </p>
    </button>
  )
}