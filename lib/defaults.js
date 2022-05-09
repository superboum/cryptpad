var Default = module.exports;

Default.commonCSP = function (Env) {
    var domain = Env.httpUnsafeOrigin;
    var sandbox = Env.httpSafeOrigin;
    sandbox = (sandbox && sandbox !== domain ? sandbox : '');
    // Content-Security-Policy

    return [
        "default-src 'none'",
        "style-src 'unsafe-inline' 'self' " + domain,
        "font-src 'self' data: " + domain,

        /*  child-src is used to restrict iframes to a set of allowed domains.
         *  connect-src is used to restrict what domains can connect to the websocket.
         *
         *  it is recommended that you configure these fields to match the
         *  domain which will serve your CryptPad instance.
         */
        "child-src " + domain,
        // IE/Edge
        "frame-src 'self' blob: " + sandbox,

        /*  this allows connections over secure or insecure websockets
            if you are deploying to production, you'll probably want to remove
            the ws://* directive
         */
        "connect-src 'self' blob: " + domain + ' ' + sandbox + ' ' + domain.replace('https://', 'wss://').replace('http://', 'ws://'),

        // data: is used by codemirror
        "img-src 'self' data: blob: " + domain,
        "media-src blob:",

        // for accounts.cryptpad.fr authentication and cross-domain iframe sandbox
        Env.enableEmbedding?  `frame-ancestors 'self' ${Env.protocol} vector:`: `frame-ancestors 'self' ${domain}`,
        "worker-src 'self'",
        ""
    ];
};

Default.contentSecurity = function (Env) {
    return (Default.commonCSP(Env).join('; ') + "script-src 'self' resource: " + Env.httpUnsafeOrigin).replace(/\s+/g, ' ');
};

Default.padContentSecurity = function (Env) {
    return (Default.commonCSP(Env).join('; ') + "script-src 'self' 'unsafe-eval' 'unsafe-inline' resource: " + Env.httpUnsafeOrigin).replace(/\s+/g, ' ');
};

Default.httpHeaders = function (Env) {
    return {
        "X-XSS-Protection": "1; mode=block",
        "X-Content-Type-Options": "nosniff",
        "Access-Control-Allow-Origin": Env.enableEmbedding? '*': Env.permittedEmbedders,
        "Permissions-policy":"interest-cohort=()"
    };
};
Default.mainPages = function () {
    return [
        'index',
        'privacy',
        'terms',
        'contact',
        'what-is-cryptpad',
        'features',
        'maintenance'
    ];
};

/*  By default the CryptPad server will run scheduled tasks every five minutes
 *  If you want to run scheduled tasks in a separate process (like a crontab)
 *  you can disable this behaviour by setting the following value to true
 */
     //disableIntegratedTasks: false,

    /*  CryptPad's file storage adaptor closes unused files after a configurable
     *  number of milliseconds (default 30000 (30 seconds))
     */
//    channelExpirationMs: 30000,

    /*  CryptPad's file storage adaptor is limited by the number of open files.
     *  When the adaptor reaches openFileLimit, it will clean up older files
     */
    //openFileLimit: 2048,




