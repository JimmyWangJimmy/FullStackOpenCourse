
const Notification = ({message}) => {
    const notificationStyle = {
        color: 'green',
        fontStyle: 'italic',
        fontSize: 16
    }

    if(message == null){
        return null
    }
    return (
        <div className="conduct" style={notificationStyle}>
            {message}
        </div>
    )
}
export default Notification