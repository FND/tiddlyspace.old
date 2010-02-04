#!/bin/bash -ex

tmpdir=/tmp/tiddlyspace-$$
if [ -d tiddlyspace ] ; then 
  mv tiddlyspace $tmpdir
  echo "moved old tiddlyspace to $tmpdir"
fi

twinstance tiddlyspace
cd tiddlyspace

osmosoft='psd ben martin jermolene fnd simon cdent rakugo mahemoff'
for user in $osmosoft ; do
  twanager adduser $user x
done

book_public_policy='{"read": ["GUEST"], "create": ["psd"], "manage": ["psd"], "accept": [], "write": ["psd"], "owner": "psd", "delete": ["psd"]}'
twanager bag book_public <<END
$book_public_policy
END
twanager recipe book_public_recipe <<END
/bags/book_public/tiddlers
END

book_private_policy='{"read": ["psd"], "create": ["psd"], "manage": ["psd"], "accept": [], "write": ["psd"], "owner": "psd", "delete": ["psd"]}'
twanager bag book_private <<END
$book_private_policy
END
twanager recipe book_private_recipe <<END
/bags/book_public/tiddlers
/bags/book_private/tiddlers
/bags/system/tiddlers
END

twanager bag book_demo_public <<END
$book_public_policy
END
twanager recipe book_demo_public_recipe <<END
/bags/book/tiddlers
/bags/book_demo/tiddlers
END

twanager bag book_demo_private <<END
$book_private_policy
END
twanager recipe book_demo_private_recipe <<END
/bags/book_public/tiddlers
/bags/book_demo_private/tiddlers
/bags/book_demo_public/tiddlers
END

osmosofties=$(echo $osmosoft|sed -e 's/  */, /g')
osmobook_public_policy='{"read": ["GUEST"], "create": ["$osmosofties"], "manage": ["$osmosofties"], "accept": [], "write": ["$osmosofties"], "owner": "$osmosofties", "delete": ["$osmosofties"]}'
osmobook_private_policy='{"read": ["$osmosofties"], "create": ["$osmosofties"], "manage": ["$osmosofties"], "accept": [], "write": ["$osmosofties"], "owner": "$osmosofties", "delete": ["$osmosofties"]}'

twanager bag osmobook_demo_public <<END
$osmobook_public_policy
END
twanager recipe osmobook_demo_public_recipe <<END
/bags/book/tiddlers
/bags/osmobook/tiddlers
END

twanager bag osmobook_demo_private <<END
$osmobook_private_policy
END
twanager recipe osmobook_demo_private_recipe <<END
/bags/book/tiddlers
/bags/osmobook_demo_public/tiddlers
/bags/osmobook_demo_private/tiddlers
/bags/system/tiddlers
END
