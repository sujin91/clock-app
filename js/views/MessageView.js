export function MessageView($target, className, text) {
    const $message = document.createElement('p')
    $message.innerHTML = text
    $message.className = className

    //warning 존재하면 삭제
    $target.querySelector(`.button_area .${className}`)?.remove();
    $target.querySelector(`.button_area`).append($message)
}
