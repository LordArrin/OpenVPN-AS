$(function () {
    $('[data-toggle="tooltip"]').tooltip()
    // Advanced VPN
    $("[name='mytooltip']").tooltip({title:'List subnets in network/nbits form', placement:'right'});
    $("[id='privnets_1']").tooltip({title:'For example: 10.2.0.0/16 or 192.168.55.0/24', placement:'right'});
    $("[id='vserver_gateway_access']").tooltip({title:'Clients can ping the VPN gateway IP address in either case', placement:'right'});
    $("[id='vs_priv_access']").tooltip({title:'NAT is preferred for client access to private networks. Routing may be useful for applications that don\'t traverse NAT', placement:'right'});
    $("[id='vc_reroute_gw']").tooltip({title:'When enabled, the client\'s default route is altered so that all traffic is routed through the VPN server\'s private network', placement:'right'});
    $("[id='vclient_gateway_access']").tooltip({title:'Clients can ping the VPN gateway IP address in either case', placement:'right'});
    $("[id='dns_1']").tooltip({title:'To use a DNS server running on the Access Server host, use \'127.0.0.1\'', placement:'right'});
    $("[id='dns_2']").tooltip({title:'To use a DNS server running on the Access Server host, use \'127.0.0.1\'', placement:'right'});
    $("[id='deens_res_zones']").tooltip({title:'Optional (may be left blank)', placement:'right'});
    $("[id='deens_domain_suffix']").tooltip({title:'Optional (may be left blank)', placement:'right'});

    $("[id='srv_name00']").tooltip({title:'This is the public name or IP address VPN clients use to connect to the Access Server', placement:'right'});
    $("[id='ismd_tcp_1']").tooltip({title:'In multi-daemon mode, specify the number of separate TCP daemons to run concurrently. For OpenVPN3 the number of thread. As a rule of thumb, set to the number of processor cores on the machine', placement:'right'});
    $("[id='ismd_tcp_2']").tooltip({title:'In multi-daemon mode and OpenVPN3 mode, specify the TCP port number', placement:'right'});
    $("[id='ismd_udp_1']").tooltip({title:'In multi-daemon mode, specify the number of separate UDP daemons to run concurrently. For OpenVPN3 the number of thread. As a rule of thumb, set to the number of processor cores on the machine', placement:'right'});
    $("[id='ismd_udp_2']").tooltip({title:'In multi-daemon mode and OpenVPN3 mode, specify the UDP port number', placement:'right'});

    //$("[id='']").tooltip({title:'', placement:'right'});
    $("[id='vclient_inter_client']").tooltip({title:'This feature allows or prevents packet routing between clients on the VPN IP Network', placement:'right'});
    $("[id='test_this']").tooltip({title:'For example: 10.2.0.0/16 or 192.168.55.0/24', placement:'right'});
    $("[id='nbt_1']").tooltip({title:'IP address of primary WINS server (optional - may be left blank)', placement:'right'});
    $("[id='nbt_2']").tooltip({title:'IP address of secondary WINS server (optional - may be left blank)', placement:'right'});
    $("[id='nbt_4']").tooltip({title:'IP address of the NetBIOS over TCP/IP Datagram Distribution Server (optional - may be left blank', placement:'bottom'});
    $("[id='nbt_5']").tooltip({title:'NetBIOS over TCP/IP Scope ID (optional - may be left blank)', placement:'bottom'});
    $("[id='vserver_config_text']").tooltip({title:'These directives are added to the VPN server configuration', placement:'right'});
    $("[id='vclient_config_text']").tooltip({title:'These directives are added to the VPN client configuration', placement:'right'});

    //$("[id='']").tooltip({title:'', placement:'right'});
    // CWS Settings
    $("[id='aclient_cb1']").tooltip({title:'Normally, the Client Web Server is accessible to all users.  Check this box to restrict it to Access Server administrators', placement:'right'});
    $("[id='aclient_relay_level']").tooltip({title:'The XML-RPC/REST API is a web service that mirrors the functionality of the Client Web Server to facilitate programmatic interaction with other software.  In most cases, enabling the limited API is sufficient for general client functionality.  Enabling the complete API is only necessary if you wish to fully control the Access Server via a custom API client', placement:'right'});
    $("[id='cws_ui_offer_server_locked']").tooltip({title:'Note: server-locked profiles do not work on mobile clients', placement:'right'});
    $("[id='cws_ui_offer_autologin']").tooltip({title:'Note: this link will only be visible to users who have autologin permission', placement:'right'});
    $("[id='cws_ui_pwd_strength']").tooltip({title:'Password must contain at least 8 characters, an uppercase letter, a lowercase letter, and a symbol from !#$%&\'()*+,-./[\]^_`{|}~<>', placement:'right'});

    // Failover
    $("[id='ucarp_2']").tooltip({title:'Enter a free LAN IP address that will be shared by both failover nodes', placement:'right'});
    if ($('.prop_autologin > div > input').prop('disabled') == true) {
        $('.prop_autologin').each(function() {
                $(this).tooltip({title: 'Auto-login is not allowed with no_client_cert=true'});
        });
    };

    // Subscription
    $("[id='sub_max_cc']").tooltip({title:'Maximum VPN connections allowed on the whole subscription.', placement:'bottom'});
    $("[id='sub_current_cc']").tooltip({title:'Current VPN connections active on this server.', placement:'bottom'});
    $("[id='sub_cc_limit']").tooltip({title:'Maximum allowed VPN connections on this server.', placement:'bottom'});
});
