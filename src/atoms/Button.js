const Button = ({ onClick, text, decorate, styles, disabled }) => {
  return (
    <button
    style={styles}
    className={decorate}
    data-action='move-prev'
    onClick={onClick}
    disabled={disabled}>{text}</button>
  )
}

export default Button
