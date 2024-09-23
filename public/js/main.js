testBtn = document.getElementById('test-btn')
testDiv = document.getElementById('test-div')

testBtn.addEventListner('click', function() {
    testDiv.innerHTML = `<h2>Something</h2>`
})