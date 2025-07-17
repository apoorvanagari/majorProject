(function () {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
})()

const textarea = document.getElementById("textarea");
const charcount = document.getElementById("charcount");
const maxLength = textarea.getAttribute("maxlength");

textarea.addEventListener("input" , () => {
const remaining = maxLength - textarea.value.length;
charcount.textContent = `${remaining}/200`;
})