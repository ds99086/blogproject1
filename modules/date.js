function getDate() {
    let now = new Date();
    let dd = now.getDate();
    if (dd < 10) { dd = '0' + dd; }
    let mm = now.getMonth() + 1;
    if (mm < 10) { mm = '0' + mm; }
    let yyyy = now.getFullYear();
    let date = `${yyyy}-${mm}-${dd}`
    return date;
}

module.exports = {getDate};