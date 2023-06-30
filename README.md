# OpenVPN-AS
 Unlocked for personal use.
 <img width="297" alt="image" src="https://github.com/LordArrin/OpenVPN-AS/assets/79581469/98de1938-d28a-4ebd-abcf-1defd25f2918">

 Set up with help:
 - [spy-soft.net](https://spy-soft.net/openvpn-access-server-limitations/)
 - [Nirob3x](https://github.com/Nirob3x/OpenVPN-As-Unlimited)
 - [rocky](https://github.com/rocky/python-decompile3)

 How-to-guide:

 1. Install Ubuntu 20.04 LTS.
 2. sudo su
 3. apt update && apt -y install ca-certificates wget net-tools gnupg
 4. wget https://as-repository.openvpn.net/as-repo-public.asc -qO /etc/apt/trusted.gpg.d/as-repository.asc
 5. echo "deb [arch=amd64 signed-by=/etc/apt/trusted.gpg.d/as-repository.asc] http://as-repository.openvpn.net/as/debian focal main">/etc/apt/sources.list.d/openvpn-as-repo.list
 6. apt update && apt -y install openvpn-as=2.11.2-72c0e923-Ubuntu20
 7. apt-mark hold openvpn-as openvpn-as-bundled-clients
 8. service openvpnas stop
 9. mv [downloaded_egg_file] /usr/local/openvpn_as/lib/python/
 10. service openvpnas start
 11. enjoy
