[TO4Server]
; Update URL
UpdateUrl=http://to4-dl.united-gameserver.de/packages/alpha
; Local update cache directory
LocalUpdateCacheDir=
; Server name in the server browser
ServerName={{to4_server_name}}
; Max player count (including reserved slots)
MaxPlayers=14
; Reserved slot count (default=2)
; For a private server, ReservedSlots must be equal MaxPlayers
;ReservedSlots=2
; Admin password
AdminPassword={{to4_server_admin_password}}
; Server password for reserved slot usage
ServerPassword=TOServerPass
; Server default map after start
ServerDefaultMap=/Game/Maps/MAP-Blister.MAP-Blister
; Map restriction parameter. The following values are possible
; ALL or empty = all maps
; CTF = Just maps with game mode "Capture the flag", make sure you set a proper round length
; TDM = Just maps with game mode "Team death match", make sure you set a proper round length
; MAP = Classic Game
MapPrefixRestriction=MAP
; Friendly fire scale in %
FriendlyFireScale=10
; Map time in min. Comment the parameter for admin tab setting
;MapLength=20
; Round time in sec. Comment the parameter for admin tab setting
;RoundLength=240
; Network port definition 
Port=7777
PeerPort=7778
; Bind the game to a special IP address
; e.g. BindIP=10.11.12.13
BindIP=
; Steam Query Server Port
GameServerQueryPort=27015
; Additional command line parameter
AdditionalParameter=
;
; Region
; US_EAST_COAST = 0
; US_WEST_COAST = 1
; SOUTH_AMERICA = 2
; EUROPE        = 3
; ASIA          = 4
; AUSTRALIA     = 5
; MIDDLE_EAST   = 6
; AFRICA        = 7
; WORLD         = 255
Region=255
; Start in Background
StartInBackground=true
; LAN mode
LanMode=false
; TO4ST - TO4 Servertools parameter
; Please do not use a double slash after the protocol with colon (http: or https:) inside the URL.
; The engine does not allow a double slash and the game server will handle it
TO4STCoreAddress=https:masterserver.tactical-operations.net/to4data/
TO4STAuthKey=
