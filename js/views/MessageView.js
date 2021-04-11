export const MessageView = ($element, className, text) => {
    const $message = document.createElement('p')
    $message.innerHTML = text
    $message.className = className

    //warning 존재하면 삭제
    document.querySelector(`.form_section .${className}`)?.remove();
    document.querySelector(`.form_section`).append($message)
}