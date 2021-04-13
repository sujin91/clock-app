export function MessageView($target, className, text) {
    const $message = document.createElement('p')
    $message.innerHTML = text
    $message.className = className

    //존재하면 삭제
    $target.querySelector(`#buttonArea .${className}`)?.remove()
    $target.querySelector(`#buttonArea`).append($message)
}
