
const label = document.getElementById("darkmode-toggle");

label.onchange = e => {
    e.stopPropagation();
    const isDark = e.target.checked;
    document.body.dispatchEvent(
        new CustomEvent('darkmode:toggle', {
            detail: {checked : isDark}
        })
    );
};


document.body.addEventListener('darkmode:toggle', e => {
    document.body.classList.toggle('dark-mode', e.detail.checked);
});