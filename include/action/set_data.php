<?php

$af = function($p) {
	$sock = \acp\connect($p['ipaddr'], $p['port'], 3);
	\acp\send($p['packs'], $sock);
	\acp\suspend($sock);
};
