;(() => {
    function O(r) {
        let c = "seline_vid",
            f = "seline-do-not-track",
            p = r.token,
            u = r.apiHost ?? "https://api.seline.com",
            d = r.maskPatterns ?? [],
            k = r.skipPatterns ?? [],
            v = r.cookieOnIdentify ?? !1,
            s = b(c),
            o = {},
            S = null,
            l = sessionStorage.getItem("seline:referrer")
                ? ""
                : document.referrer
        function b(t) {
            const e = document.cookie.match(new RegExp(`(^|;\\s*)${t}=([^;]*)`))
            return e ? decodeURIComponent(e[2]) : null
        }
        function E(t, e, i = 365) {
            const n = new Date()
            n.setTime(n.getTime() + i * 24 * 60 * 60 * 1e3)
            const a = location.hostname.split(".").slice(-2).join(".")
            document.cookie = `${t}=${encodeURIComponent(e)};expires=${n.toUTCString()};path=/;domain=.${a};SameSite=Lax`
        }
        function I() {
            return localStorage.getItem(f) === "1"
        }
        function T() {
            localStorage.setItem(f, "1")
        }
        function A() {
            const t = history.pushState
            ;(history.pushState = function (...i) {
                t.apply(this, i), g()
            }),
                addEventListener("popstate", () => g())
            function e() {
                !S && document.visibilityState === "visible" && g()
            }
            document.visibilityState !== "visible"
                ? document.addEventListener("visibilitychange", e)
                : g(),
                C()
        }
        function R(t = !1) {
            ;(r.autoPageView && !t) || ((r.autoPageView = !0), A())
        }
        function w(t) {
            const e = k.map(
                    (n) => new RegExp(`^${n.replace(/\*/g, "[^/]+")}$`)
                ),
                i = d.map((n) => new RegExp(`^${n.replace(/\*/g, "[^/]+")}$`))
            if (e.some((n) => n.test(t))) return null
            for (let n = 0; n < d.length; n++) if (i[n].test(t)) return d[n]
            return t
        }
        function h(t, e, i = !0) {
            if (I()) return Promise.resolve()
            const n = { ...e }
            return (
                o.userId && (n.visitorId = o.userId),
                s && (n.visitorId = s),
                i && navigator?.sendBeacon
                    ? (navigator.sendBeacon(t, JSON.stringify(n)),
                      Promise.resolve())
                    : fetch(t, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(n),
                          keepalive: !0
                      })
            )
        }
        function P(t) {
            h(`${u}/s/e`, { token: p, ...t }, !0)
        }
        function y(t, e) {
            const i = w(window.location.pathname)
            i && P({ pathname: i + window.location.search, name: t, data: e })
        }
        function g(t) {
            const e = t ?? window.location.pathname
            if (S === e) return
            S = e
            const i = w(e)
            i &&
                ((!l || l.includes(window.location.hostname)) && (l = null),
                P({
                    pathname: t ? i : i + window.location.search,
                    referrer: l
                }),
                l &&
                    ((l = null),
                    sessionStorage.setItem("seline:referrer", "set")))
        }
        function $(t) {
            ;(o = { ...o, ...t }),
                h(`${u}/s/su`, { token: p, fields: o }, !1).then(async (e) => {
                    if (e) {
                        const i = await e.json()
                        i?.visitorId && ((s = i.visitorId), v && E(c, s))
                    }
                })
        }
        function C() {
            document.addEventListener("click", (t) => {
                let e = t.target
                if (
                    !e ||
                    ((e.tagName === "INPUT" ||
                        e.tagName === "SELECT" ||
                        e.tagName === "TEXTAREA") &&
                        e.type !== "submit")
                )
                    return
                for (; e && !e?.hasAttribute("data-sln-event"); )
                    e = e.parentElement
                if (!e) return
                const i = e.getAttribute("data-sln-event")
                if (!i) return
                const n = {}
                for (const a of Array.from(e.attributes))
                    a.name.startsWith("data-sln-event-") &&
                        a.value &&
                        (n[a.name.slice(15)] = a.value)
                if (e.tagName === "FORM") {
                    const a = e,
                        N = Array.from(a.elements)
                    for (const m of N)
                        m.type !== "password" &&
                            m.name &&
                            m.value &&
                            (n[m.name] = m.value)
                }
                y(i, n)
            })
        }
        return {
            track: y,
            page: g,
            setUser: $,
            enableAutoPageView: R,
            doNotTrack: T
        }
    }
    if (!window.seline) {
        const c = (s) =>
                s
                    ? s
                          .replace(/^\[|\]$/g, "")
                          .split(",")
                          .map((o) => o.trim().replace(/^['"]|['"]$/g, ""))
                          .filter(Boolean)
                    : [],
            r = document.currentScript?.getAttribute("data-token"),
            f = c(document.currentScript?.getAttribute("data-skip-patterns")),
            p = c(document.currentScript?.getAttribute("data-mask-patterns")),
            u =
                document.currentScript?.getAttribute("data-auto-page-view") !==
                "false",
            d = document.currentScript?.getAttribute("data-api-host"),
            k =
                document.currentScript?.getAttribute(
                    "data-cookie-on-identify"
                ) === "true",
            v = O({
                token: r,
                skipPatterns: f,
                maskPatterns: p,
                autoPageView: u,
                apiHost: d,
                cookieOnIdentify: k
            })
        ;(window.seline = v), u && v.enableAutoPageView(!0)
    }
})()
