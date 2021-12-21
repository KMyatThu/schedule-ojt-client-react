const Button = ({ onClick, text, decorate, styles }) => {
  return (
    <button
    style={styles}
    className={decorate}
    data-action='move-prev'
    onClick={onClick}>{text}</button>
  )
}

export default Button
