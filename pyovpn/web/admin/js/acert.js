$(function () {
    $('#ca-table').DataTable({
        "paging":  false,
        "info": false,
        "iDisplayLength": -1
    });

    $('#deleteModal').on('show.bs.modal', function(e) {
        var ca_cn = $(e.relatedTarget).data('ca-cn');
        var ca_sn = $(e.relatedTarget).data('ca-sn');
        $(e.currentTarget).find('#delBtn').val('DEL_'+ca_sn);
        $(e.currentTarget).find('#deleteModalLabel').text("Delete #" + ca_sn + " " + ca_cn + " and all User Profiles");
    });

    $('#agreeDelete').change(function(){
        button = $("#delBtn");
        if(this.checked){
            button.removeAttr("disabled");
        } else {
            button.attr("disabled","disabled");
        }
    });

    $("select").on("changed.bs.select",
      function(e, clickedIndex, newValue, oldValue) {
          console.log(this.value, clickedIndex, newValue, oldValue)
          var select = document.getElementById('select-algo');
          var btn = document.getElementById('submitBtn');
          btn.disabled = !select.value;
      });
});
