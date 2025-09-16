
flatpickr("#check-in", {
    dateFormat: "Y-m-d",
    minDate: "today",
    disable: window.disableDates,
    onChange: function(selectedDates) {
      if (selectedDates[0]) {
        checkout.set('minDate', selectedDates[0]);
      }
    }
  });

  const checkout = flatpickr("#checkout", {
    dateFormat: "Y-m-d",
    minDate: "today",
    disable: window.disableDates
  });