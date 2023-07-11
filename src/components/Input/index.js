import InputMask from "react-input-mask"

export default function Input({ value, onChange, required, type, mask, maxLength, placeholder, label, minLength, invalid, invalidDescription, disabled }) {


  function onHandleChange(event) {
    let eventValue = event.target.value
    invalid = false
    invalidDescription = null
    onChange(eventValue)
  }

  return (
    <div className="mt-7  max-w-xl m-auto">
      <label className="default-input-title">
        {`${label ? label + ':' : ''}`}
      </label>
      {mask ?
        <InputMask
          className={`default-input ${invalid && 'border-2 border-solid border-red-400 placeholder-red-400 text-red-500 outline-red-400 focus:outline-red-400 hover:outline-red-400 hover:border-red-400'}`}
          mask={mask}
          required={required}
          minLength={minLength}
          placeholder={placeholder}
          onChange={onHandleChange}
          maskChar={null}
          value={value}
          disabled={disabled ? disabled : false}
        /> : <input
          className={`default-input ${invalid && 'border-2 border-solid border-red-400 placeholder-red-400 text-red-400 outline-red-400'} `}
          required={required}
          type={type}
          minLength={minLength}
          placeholder={placeholder}
          onChange={onHandleChange}
          maxLength={maxLength}
          value={value}
          disabled={disabled ? disabled : false}
        />
      }
      {invalidDescription && <p className={`absolute mt-2 ml-2 text-lg ${invalid ? 'text-red-500' : ''} animate-pulse`}>{invalidDescription}</p>}

    </div>
  )
}