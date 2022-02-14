const generate_btn = document.querySelector('.generate-btn')
const show_pin = document.querySelector('.show-generated-span')
const panel_slots = document.querySelector('.input-panels')
const notify_section = document.querySelector('#bootToast')

let totalTrial = 3

generate_btn.addEventListener('click', generateRandomNum)

startMatching()

function startMatching() {
    document.addEventListener('click', mouseClickHandler)
    document.addEventListener('keyup', keyupHandler)
}

function stopMatching() {
    document.removeEventListener('click', mouseClickHandler)
    document.removeEventListener('keyup', keyupHandler)
}

function mouseClickHandler(event) {
    if (event.target.matches('[data-key]')) {
        pressKeyBoard(event.target.dataset.key)
        return
    }
    if (event.target.matches('[data-delete]')) {
        resetSlots()
        return
    }
    if (event.target.matches('[data-enter]')) {
        submitMatch()
        return
    }
}

function keyupHandler(event) {
    if (event.key === 'Enter') {
        submitMatch()
        return
    }
    if (event.key === 'Backspace' || event.key === 'Delete') {
        resetSlots()
        return
    }
    if (event.key.match(/^[0-9]$/)) {
        pressKeyBoard(event.key)
        return
    }
}

function generateRandomNum(e) {
    startMatching()
    const random_number = Math.random().toFixed(4).substring(2)
    show_pin.innerText = random_number
    resetSlots()
    totalTrial = 3
}

function submitMatch() {
    if(!trialCounter()) return;
    const activeSlots = [...getActiveSlots()]
    if (activeSlots.length !== 4) {
        notify_section.innerHTML = `<p class="notify">❌ Not enough letters.</p>`
        createToast()
        shakeTheSlots()
        return
    }
    const givenPin = activeSlots.reduce((pin, slot) => {
        return pin + slot.dataset.letter
    }, '')

    if (show_pin.innerText === givenPin) {
        notify_section.innerHTML = `<p class="notify">✅ Pin Matched... Secret door is opening for you</p>`
        createToast()
    } else {
        notify_section.innerHTML = `<p class="notify">❌ Pin Didn't Match, Please try again</p>`
        createToast()
        shakeTheSlots()
        return
    }
}

function resetSlots() {
    const activeSlots = getActiveSlots()
    activeSlots.forEach((slot) => {
        slot.textContent = ''
        delete slot.dataset.letter
        delete slot.dataset.state
    })
}

function pressKeyBoard(key) {
    const activeSlots = getActiveSlots()
    if (activeSlots.length >= 4) return
    const inactivePanel = panel_slots.querySelector(':not([data-letter])')
    inactivePanel.dataset.letter = key
    inactivePanel.textContent = key
    inactivePanel.dataset.state = 'active'
}

function getActiveSlots() {
    return panel_slots.querySelectorAll("[data-state='active']")
}
function shakeTheSlots(){
    document.querySelectorAll(".input-panel").forEach(slot=>{
        slot.classList.add("shake")
        slot.addEventListener("animationend",()=>{
            slot.classList.remove("shake")
        },{once:true})
    })
}
function trialCounter() {
    --totalTrial
    if (totalTrial < 0) {
        notify_section.innerHTML = `<p class="notify">❌ Sorry,You have exceeded the trial limit.GENERATE NEW PIN TO START OVER.</p>`
        createToast()
        stopMatching()
        return false
    }
    return true;
}

function createToast() {
    var element = document.getElementById('bootToast')
    // Create toast instance
    var myToast = new bootstrap.Toast(element)
    myToast.show()
}


