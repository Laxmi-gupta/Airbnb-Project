(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    const checkin = document.querySelector('#check-in')
    const checkout = document.querySelector('#checkout')
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

       // Extra validation for flatpickr fields
      if (!checkin.value) {
        event.preventDefault()
        event.stopPropagation()
        checkin.classList.add('is-invalid')
      } else {
        checkin.classList.remove('is-invalid')
      }

      if (!checkout.value) {
        event.preventDefault()
        event.stopPropagation()
        checkout.classList.add('is-invalid')
      } else {
        checkout.classList.remove('is-invalid')
      }


      form.classList.add('was-validated')
    }, false)
  })
})()