export default function Button({ className, children, type, onClick, disabled }) {
  className = disabled ? `${className} bg-gray-600 hover:bg-gray-700 hover:scale-100 cursor-default` : className
  return (
    <>
      <button type={type} className={`default-button  ${className}`} onClick={onClick} disabled={disabled}>
        {children}
      </button>
    </>
  )
}