$(function () {
    $('#log-table').DataTable({"paging":  false, "info": false,  "language": {
	search: '<i class="fa fa-filter" aria-hidden="true"></i>',
	searchPlaceholder: 'filter records'
    }});

    $('#box-current-users-table').DataTable({"paging":  false, "info": false});
    $('#checkbox-table').DataTable({"paging":  false, "info": false});

    // Spinner for ‘Exit Remove View/Edit’ button [AS-681]
    $("#exit-remote-view-edit-btn").click(function(){
	$("#exit-remote-view-edit-btn").hide();
	$("#exit-remote-view-edit-spin").show();
    });

    ///////////////////////////////////////////// Show / Hide Divs ///////////////////////////////////////////////////

    // Clustering
    // Automatically Toggle cluster.rr_dns_update, if there is some text in rr_dns_hostname
    $("input[name*='cluster.rr_dns_hostname']").keyup(function () {
	if ($(this).val() == "") {
            $("input[name*='cluster.rr_dns_update']").bootstrapToggle('off');
	    $("input[name*='cluster.rr_dns_new_nodes']").bootstrapToggle('off');
	} else {
            $("input[name*='cluster.rr_dns_update']").bootstrapToggle('on');
	    $("input[name*='cluster.rr_dns_new_nodes']").bootstrapToggle('on');
	}
    });
    
    if ($('#no_clustering').prop('checked')) {
	$('.cluster_create_or_join').hide();
	$('#div_dns_hostname').hide();
	$('#div_join_cluster_user_warning').hide();
	$('#div_cluster_profile').hide();
    }

    if ($('#join_existing_cluster').prop('checked')) {
	$('.cluster_create_or_join').show();
	$('#div_dns_hostname').hide();
	$('#div_cluster_profile').hide();
    }

    if ($('#create_new_cluster').prop('checked')) {
	$('.cluster_create_or_join').show();
	$('#div_join_cluster_user_warning').hide();
	$('#div_dns_hostname').show();
	$('#div_cluster_profile').show();
    }

    $("input[name*='cluster.setting']").change(function(){
	if ($('#no_clustering').prop('checked')) {
	    $('.cluster_create_or_join').hide();
	    $('#div_join_cluster_user_warning').hide();
	    $('#div_dns_hostname').hide();
	    $('#div_cluster_profile').hide();
	}
	else if ($('#join_existing_cluster').prop('checked')) {
	    
	    $('.cluster_create_or_join').fadeIn();
	    $('#div_dns_hostname').hide();
	    $('#div_join_cluster_user_warning').fadeIn();
	    	$('#div_cluster_profile').hide();
    	}
	else if ($('#create_new_cluster').prop('checked')) {
	    $('.cluster_create_or_join').fadeIn();
	    $('#div_dns_hostname').fadeIn();
	    $('#div_cluster_profile').fadeIn();
	    $('#div_join_cluster_user_warning').hide();
    	}
    });
    
    // Other
    $("input[name='vpn.client.routing.inter_client']").prop('checked') ? $('#superuser_0').hide() : $('#superuser_0').show();
    $("input[name='vpn.client.routing.inter_client']").change(function() { $("input[name='vpn.client.routing.inter_client']").prop('checked') ? $('#superuser_0').fadeOut() : $('#superuser_0').fadeIn(); });

    $('#sc1_1dns').prop('checked') ? $('#client_dns_servers').show() : $('#client_dns_servers').hide();
    $('#vclient_reroute_dns').change(function(){$('#sc1_1dns').prop('checked') ? $('#client_dns_servers').fadeIn() : $('#client_dns_servers').fadeOut(); });

    $('#sc2_1nbt').prop('checked') ? $('#div_dhcp_opt_win').show() : $('#div_dhcp_opt_win').hide();
    $('#sc2_1nbt').change(function() {$('#sc2_1nbt').prop('checked') ? $('#div_dhcp_opt_win').fadeIn() : $('#div_dhcp_opt_win').fadeOut(); });

    // LDAP
    $('#sc0_1use_bind_dn').prop('checked') ? $('#div_bind_cred').show() : $('#div_bind_cred').hide();
    $('#sc0_1use_bind_dn').change(function(){
	$('#sc0_1use_bind_dn').prop('checked') ? $('#div_bind_cred').fadeIn() : $('#div_bind_cred').fadeOut();    });

    // vpnconf {
    if ($('#sc2_1privnets_1access').prop('checked')) {
	$('#privnets').show();
	$('#access_1').show();
     }

    $('#sc2_1privnets_1access').change(function(){
	if ($('#sc2_1privnets_1access').prop('checked')) {
	    $('#privnets').fadeIn();
	    $('#access_1').fadeIn();
	}
    });

     if ($('#sc1_1privnets_0access').prop('checked')) {
	$('#privnets').show();
	$('#access_1').hide();
    }

    $('#sc1_1privnets_0access').change(function(){
	if ($('#sc1_1privnets_0access').prop('checked')) {
	    $('#privnets').fadeIn();
	    $('#access_1').fadeOut();
	}
    });

    if ($('#sc0_0privnets_0access').prop('checked')) {
	$('#privnets').hide();
	$('#access_1').hide();
    }

    $('#sc0_0privnets_0access').change(function(){
	if ($('#sc0_0privnets_0access').prop('checked')) {
	    $('#privnets').fadeOut();
	    $('#access_1').fadeOut();
	}
    });
    //}

    $('#sc1_1cshare').prop('checked') ? $('#cshare_00').show() : $('#cshare_00').hide();
    $('#sc1_1cshare').change(function() {$('#sc1_1cshare').prop('checked') ? $('#cshare_00').fadeIn() : $('#cshare_00').fadeOut(); });


    if ($('#sc2_md').prop('checked')) {
 	    $('#istcp_00').show();
	    $('#issd_1').hide();
	    $('#ismd_0').show();
	    $('#ismd_tcp_1').show();
  	    $('#ismd_tcp_2').show();
	    $('#ismd_udp_1').show();
  	    $('#ismd_udp_2').show();
    }

    if ($('#sc1_sd_udp').prop('checked')) {
 	    $('#istcp_00').hide();
	    $('#issd_1').show();
	    $('#ismd_0').hide();
    } 

    if ($('#sc0_sd_tcp').prop('checked')) {
 	    $('#istcp_00').show();
	    $('#issd_1').show();
	    $('#ismd_0').hide();
    }

    if ($('#sc0_o3_tcp').prop('checked')) {
 	    $('#istcp_00').show();
	    $('#issd_1').hide();
	    $('#ismd_0').show();
  	    $('#ismd_tcp_1').show();
  	    $('#ismd_tcp_2').show();
  	    $('#ismd_udp_1').hide();
  	    $('#ismd_udp_2').hide();
    }

    if ($('#sc1_o3_udp').prop('checked')) {
 	    $('#istcp_00').show();
	    $('#issd_1').hide();
	    $('#ismd_0').show();
  	    $('#ismd_tcp_1').hide();
  	    $('#ismd_tcp_2').hide();
  	    $('#ismd_udp_1').show();
  	    $('#ismd_udp_2').show();
    }


    $('#sc2_md').change(function(){
	if ($('#sc2_md').prop('checked')) {
 	    $('#istcp_00').fadeIn();
	    $('#issd_1').fadeOut();
	    $('#ismd_0').fadeIn();
	    $('#ismd_tcp_1').fadeIn();
  	    $('#ismd_tcp_2').fadeIn();
  	    $('#ismd_udp_1').fadeIn();
  	    $('#ismd_udp_2').fadeIn();
	} 
    });
    $('#sc1_sd_udp').change(function(){
	if ($('#sc1_sd_udp').prop('checked')) {
 	    $('#istcp_00').fadeOut();
	    $('#issd_1').fadeIn();
	    $('#ismd_0').fadeOut();
	} 
    });
    $('#sc0_sd_tcp').change(function(){
	if ($('#sc0_sd_tcp').prop('checked')) {
 	    $('#istcp_00').fadeIn();
	    $('#issd_1').fadeIn();
	    $('#ismd_0').fadeOut();
	}
    });

    $('#sc0_o3_tcp').change(function(){
	if ($('#sc0_o3_tcp').prop('checked')) {
 	    $('#istcp_00').fadeIn();
	    $('#issd_1').fadeOut();
	    $('#ismd_0').fadeIn();
	    $('#ismd_tcp_1').fadeIn();
  	    $('#ismd_tcp_2').fadeIn();
  	    $('#ismd_udp_1').fadeOut();
  	    $('#ismd_udp_2').fadeOut();
	}
    });

    $('#sc1_o3_udp').change(function(){
	if ($('#sc1_o3_udp').prop('checked')) {
 	    $('#istcp_00').fadeIn();
	    $('#issd_1').fadeOut();
	    $('#ismd_0').fadeIn();
	    $('#ismd_tcp_1').fadeOut();
  	    $('#ismd_tcp_2').fadeOut();
  	    $('#ismd_udp_1').fadeIn();
  	    $('#ismd_udp_2').fadeIn();
	}
    });

    // Failover
    $('#sc1_1ucarp_0dnsfo').prop('checked') ? $('#div_ucarp').show():  $('#div_ucarp').hide();
    $('#sc1_1ucarp_0dnsfo').change(function(){
	$('#sc1_1ucarp_0dnsfo').prop('checked') ? $('#div_ucarp').fadeIn():  $('#div_ucarp').fadeOut();
    });


    ////////////////////////////// Convert Checkboxes to behave like Radio Buttons/////////////////////////////////////
    $('.testra').on('change', function bananamuffin() {
	$('.testra').unbind('change', bananamuffin);

	var group = "input:checkbox[name='"+$(this).attr("name")+"']";
	var banana = $(this).attr("id");

	$(group).each(function () {
	    var some_id = $(this).attr('id');
	    if (banana != some_id) {
		$(this).bootstrapToggle('off');
	    } else {
		$(this).bootstrapToggle('on');
	    }
	});

	$('.testra').bind('change', bananamuffin);
    });
});

function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], {type: "text/plain"});

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}



function exportTableToCSV(filename) {
    var csv = [];
    var rows = document.querySelectorAll("table tr");

    for (var i = 2; i < rows.length; i++) {
	var row = [], cols = rows[i].querySelectorAll("td, th");

	for (var j = 0; j < cols.length; j++)
	    row.push(cols[j].innerText);

	csv.push(row.join(","));
    }

    // Download CSV file
    downloadCSV(csv.join("\n"), filename);
}

    // function on_change_func(master, slave) {
    //	return "$(\'#"+master+"').change(function(){$('#"+master+"').prop('checked')?$('#"+slave+"').fadeIn():$('#"+slave+"').fadeOut();});"
    // }
    // eval(on_change("sc2_1nbt", "div_dhcp_opt_win"));

