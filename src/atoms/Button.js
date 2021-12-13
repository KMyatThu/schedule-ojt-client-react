const Button = ({ onClick, text, decorate }) => {
  return (
    <button
    style={{ marginRight: '4px' }} 
    className={decorate}
    data-action='move-prev'
    onClick={onClick}>{text}</button>
  )
}

export default Button
