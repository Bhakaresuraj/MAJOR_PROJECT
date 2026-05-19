// Example starter JavaScript for disabling form submissions if there are invalid fields
(() => {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    const forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', event => {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
            }

            form.classList.add('was-validated')
        }, false)
    })
})()

document.addEventListener("DOMContentLoaded", () => {
    const taxSwitch = document.getElementById("taxSwitch");
    const taxInfos = document.querySelectorAll(".tax-info");
    const filters = document.querySelectorAll(".filter");

    if (taxSwitch) {
        taxSwitch.addEventListener("change", () => {
            taxInfos.forEach((info) => {
                info.style.display = taxSwitch.checked ? "inline" : "none";
            });
        });
    }

    filters.forEach((filter) => {
        filter.addEventListener("click", () => {
            filters.forEach((item) => item.classList.remove("active"));
            filter.classList.add("active");
        });
    });
});