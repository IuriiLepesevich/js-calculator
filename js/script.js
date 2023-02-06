const resultField = document.querySelector('.result');

const buttonNumbers = document.querySelectorAll('.number');

const buttonDelete = document.querySelector('.delete');

for(const button of buttonNumbers) {
    button.addEventListener('click', function(){
        resultField.value += parseInt(this.textContent);
    });
}

buttonDelete.addEventListener('click', function() {
    if(resultField.value.length) {
        resultField.value = resultField.value.slice(0, -1);
    }
});