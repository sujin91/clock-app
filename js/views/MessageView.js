export const MessageView = ($element, className, text) => {
    const $message = document.createElement('p')
    $message.innerHTML = text
    $message.className = className

    //warning 존재하면 삭제
    $element.parentNode.querySelector(`.${className}`)?.remove();
    $element.parentNode.append($message)
}