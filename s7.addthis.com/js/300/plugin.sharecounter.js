/* (c) 2008-2012 Add This, LLC */
//* vim: set expandtab tabstop=4 shiftwidth=4: */
/* -*- Mode: JavaScript; tab-width: 4; indent-tabs-mode: nil; -*- */

/**
* Cookie writing module. Prehistoric sck(), gov(), kck() syntax preserved for now.
*/

(function(_addthis, addthis, env){
    var
    d = document,
    isWriteable = 0;

    function canWeWrite() {
        if (isWriteable) return 1;

        // confirm cookie setting is possible
        set('xtc',1);
        if (1 == _addthis.cookie.rck('xtc')) {
            isWriteable = 1;
        }
        kill('xtc',1);

        return isWriteable;
    }

    function checkForGovSite(host) {
        if (_atc.xck) return; // no need to do more processing if cookies are already off

        var i, p, x, h = host || _ate.dh || _ate.du || (_ate.dl ? _ate.dl.hostname : '');
        // set cookie if xck (block cookies) not set
        if (h.indexOf('.gov') > -1 || h.indexOf('.mil') > -1) {
            _atc.xck = 1;
            return;
        }
        // some sites were here but no longer need to be on account of .govness:
        // massgov, usagov, dodpubweb, disamil, education, govgab1, gobiernousa
        p = typeof(_addthis.pub) === 'function' ? _addthis.pub() : _addthis.pub;
        x = ['usarmymedia','govdelivery'];
        for (i in x) {
            if (p == x[i]) {
                _atc.xck = 1;
                break;
            }
        }
    }

    // kill cookie
    function kill (k, ud) {
        if (d.cookie) d.cookie = k+'=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/' + (ud ? '; domain='+(_addthis.bro.msi?'':'.')+'addthis.com' : '');
    }

    // set document/domain cookie
    function set (u,v,s /* true for session cookie */, nd /* true to skip domain */, expires) {
        if (!window.at_sub) checkForGovSite();
        if (!_atc.xck && (!nd || ((window.addthis_config||{}).data_use_cookies_ondomain !== false && (window.addthis_config||{}).data_use_cookies !== false))) {
            if (!expires) {
                // Expire all cookies exactly two years from now
                expires = new Date();
                expires.setYear(expires.getFullYear() + 2); 
            }

            // IE(6) ignores the leading "." in a domained cookie when determining which cookies to send; .addthis.com == addthis.com 
            // Yet trying to set a .addthis.com cookie in a third-party context always is blocked by the security filter!
            // So, in IE we set the domain to "addthis.com". And don't ask questions.
            document.cookie = u+'='+v+(!s?'; expires='+expires.toUTCString():'')+'; path=/;' + (!nd ? ' domain=' + (_addthis.bro.msi ? '' : '.') + 'addthis.com' : '');
        }
    }

    if (!_addthis.cookie) _addthis.cookie = {};

    _addthis.cookie.sck = set;
    _addthis.cookie.kck = kill;
    _addthis.cookie.cww = canWeWrite;
    _addthis.cookie.gov = checkForGovSite;
})(_ate, _ate.api, _ate);
/* vim: set expandtab tabstop=4 shiftwidth=4: */

/**
* Callback manager for JSONP endpoints.
*/

(function(_addthis, addthis, env){
    var
    u = _addthis.util,
    pageCallbacks = {},
    timeouts = {};

    if (!_addthis.cbs) _addthis.cbs = {}; // needs to be publicly addressable

    function storeCallback(prefix, key, callback, onTimeout, noCacheBust) {
        key = (_euc(key)).replace(/[0-3][A-Z]|[^a-zA-Z0-9]/g,'');
        pageCallbacks[key] = pageCallbacks[key] || 0;
        var cbidx = pageCallbacks[key]++,
            cbname = prefix + '_' + key + (!noCacheBust ? cbidx : '');

        if (!_ate.cbs[cbname]) {
            _ate.cbs[cbname] = function () {
                if (timeouts[cbname]) clearTimeout(timeouts[cbname]); // cancel error timeout
                callback.apply(this, arguments); // pass through callback data
            };
        }
        _ate.cbs['time_'+cbname] = (new Date()).getTime(); // store time of last call

        if (onTimeout) {
            clearTimeout(timeouts[cbname]);
            timeouts[cbname] = setTimeout(onTimeout, 10000);
        }

        return '_ate.cbs.'+_euc(cbname);
    }

    u.scb = storeCallback;
})(_ate, _ate.api, _ate);
