/*! energy-flow-card 0.9.5 | MIT License | https://github.com/BieleckiLtd/energy-flow-card */
(() => {
"use strict";
const VERSION = "0.9.5";
const SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1170 1408\" class=\"ef\" data-weather=\"rain\" role=\"img\" aria-label=\"Energy flow between solar, batteries, home and grid\">\n<defs>\n<style><![CDATA[\n.ef-cap{font:400 32px \"SF Pro Display\",-apple-system,system-ui,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif;letter-spacing:1.6px;fill:#aeb2b8}\n.ef-val{font:500 47px \"SF Pro Display\",-apple-system,system-ui,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif;letter-spacing:.6px;fill:#f4f4f4}\n.ef-idle{fill:#a4a6aa}\n#ef-labels text,#ef-labels tspan{transition:fill .42s ease-in-out}\n#ef-labels text{filter:drop-shadow(1.5px 1.5px .6px #000)}\n.ef-extras{pointer-events:none;height:100%;overflow:hidden;display:flex;flex-direction:column;\n  font:400 26px/38px \"SF Pro Display\",-apple-system,system-ui,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,sans-serif;letter-spacing:.6px}\n.ef-extra{pointer-events:auto;display:grid;grid-template-columns:1fr 1fr;column-gap:14px;white-space:nowrap;flex:none;height:38px;\n  transition:height .5s cubic-bezier(.3,.7,.2,1),opacity .4s ease .12s,transform .5s cubic-bezier(.3,.7,.2,1)}\n.ef-extra:first-child{margin-top:auto}\n.ef-extra.ef-extra-off{height:0;opacity:0;transform:translateY(10px);\n  transition:height .5s cubic-bezier(.3,.7,.2,1) .1s,opacity .25s ease,transform .35s ease}\n#ef-labels,#ef-labels *{cursor:default;-webkit-user-select:none;user-select:none}\n.ef-extra-name{text-align:right;color:#8f939a}\n.ef-extra span{transition:color .42s ease-in-out;text-shadow:1.2px 1.2px .5px #000}\n.ef-extra-val{color:#e6e8eb;font-weight:500}\n.ef-extra.ef-extra-edge .ef-extra-name{color:rgb(143 147 154/.3)}\n.ef-extra.ef-extra-edge .ef-extra-val{color:rgb(230 232 235/.3)}\n.ef-extra.ef-extra-edge span{text-shadow:none}\n.ef-dir{font-size:28px;letter-spacing:0}\n.ef-lead{fill:none;stroke:#fff;stroke-opacity:.34;stroke-width:3.2;stroke-linecap:round}\n.ef-lane{fill:none;stroke:#343434;stroke-width:13}\n.ef-pipe-shade{fill:none;stroke:#000;stroke-opacity:.3;stroke-width:4.2;transform:translate(.9px,4.2px)}\n.ef-grid-pipe .ef-pipe-shade{transform:translate(-4px,2.2px)}\n.ef-pv-skylight{opacity:1}\n.ef[data-time=night] .ef-pv-skylight{opacity:.1}\n.ef-pv-cell-detail{opacity:.86}\n.ef[data-time=night] .ef-pv-cell-detail{opacity:.4}\n:is(.ef-grid-pipe .ef-flow,.ef-flow[style*=\"--ef-turns\"]){animation-name:ef-grid-beat;animation-duration:calc(var(--ef-cycle-period,4.8s) * var(--ef-turns,1))}\n.ef-reflection{opacity:.2}\n.ef[data-weather=drizzle] .ef-reflection,.ef[data-weather=rain] .ef-reflection,.ef[data-weather=heavy] .ef-reflection,.ef[data-weather=storm] .ef-reflection{opacity:.38}\n.ef-line .ef-lane{stroke:#4c4c4c;stroke-opacity:.55}\n.ef-line .ef-pipe-shade{stroke:#fff;stroke-opacity:.09;transform:translate(-7.5px,-2.65px)}\n.ef-front{stroke-width:10.8}\n.ef-grid-top{stroke-width:9}\n.ef-grid-side{stroke-width:4}\n.ef-solar-front{stroke-width:9}\n.ef-solar-side{stroke-width:4}\n.ef-top{stroke-width:2.2;stroke:var(--ef-flow-color,var(--ef-source-color))}\n.ef-line{transition:transform .55s cubic-bezier(.3,.7,.2,1),opacity .4s ease,visibility 0s}\n.ef-line.ef-gone{opacity:0;visibility:hidden;transition:transform .55s cubic-bezier(.3,.7,.2,1),opacity .4s ease,visibility 0s .55s}\n.ef-still .ef-line,.ef-swap .ef-line{transition:none!important}\n.ef-shared :is(.ef-lane,.ef-pipe-shade){visibility:hidden}\n@property --ef-beat{syntax:\"<number>\";inherits:true;initial-value:0}\n.ef{--ef-cycle-distance:480}\n.ef-flow{animation:ef-flow-beat var(--ef-cycle-period,4.8s) linear infinite;fill:none;stroke:var(--ef-flow-color,var(--ef-source-color));stroke-width:13;stroke-linecap:butt;\n  --ef-direction:-1;--ef-leading-edge:1}\n.ef-flow[data-flow=in]{--ef-direction:1;--ef-leading-edge:0}\n.ef-flow[data-flow=off]{display:none}\n.ef-gl .ef-pulse{display:none}\n.ef-gl .ef-flow{animation:none}\n.ef-pulse{stroke-dasharray:var(--ef-length) calc(var(--ef-cycle-distance) * var(--ef-turns,1) - var(--ef-length));\n  stroke-dashoffset:calc(var(--ef-leading-edge) * var(--ef-length) + var(--ef-direction) * var(--ef-beat,0) - var(--ef-junction,0) + var(--ef-turn,0) * var(--ef-cycle-distance))}\n.ef-p1{--ef-length:148;opacity:0.0003}\n.ef-p2{--ef-length:145.5;opacity:0.0027}\n.ef-p3{--ef-length:143;opacity:0.0055}\n.ef-p4{--ef-length:140.5;opacity:0.0081}\n.ef-p5{--ef-length:138;opacity:0.0107}\n.ef-p6{--ef-length:135.5;opacity:0.0132}\n.ef-p7{--ef-length:133;opacity:0.0156}\n.ef-p8{--ef-length:130.5;opacity:0.0177}\n.ef-p9{--ef-length:128;opacity:0.0196}\n.ef-p10{--ef-length:125.5;opacity:0.0210}\n.ef-p11{--ef-length:123;opacity:0.0220}\n.ef-p12{--ef-length:120.5;opacity:0.0222}\n.ef-p13{--ef-length:118;opacity:0.0216}\n.ef-p14{--ef-length:115.5;opacity:0.0199}\n.ef-p15{--ef-length:113;opacity:0.0168}\n.ef-p16{--ef-length:110.5;opacity:0.0124}\n.ef-p17{--ef-length:108;opacity:0.0115}\n.ef-p18{--ef-length:105.5;opacity:0.0121}\n.ef-p19{--ef-length:103;opacity:0.0128}\n.ef-p20{--ef-length:100.5;opacity:0.0135}\n.ef-p21{--ef-length:98;opacity:0.0143}\n.ef-p22{--ef-length:95.5;opacity:0.0152}\n.ef-p23{--ef-length:93;opacity:0.0161}\n.ef-p24{--ef-length:90.5;opacity:0.0171}\n.ef-p25{--ef-length:88;opacity:0.0181}\n.ef-p26{--ef-length:85.5;opacity:0.0193}\n.ef-p27{--ef-length:83;opacity:0.0205}\n.ef-p28{--ef-length:80.5;opacity:0.0219}\n.ef-p29{--ef-length:78;opacity:0.0234}\n.ef-p30{--ef-length:75.5;opacity:0.0250}\n.ef-p31{--ef-length:73;opacity:0.0267}\n.ef-p32{--ef-length:70.5;opacity:0.0287}\n.ef-p33{--ef-length:68;opacity:0.0308}\n.ef-p34{--ef-length:65.5;opacity:0.0332}\n.ef-p35{--ef-length:63;opacity:0.0359}\n.ef-p36{--ef-length:60.5;opacity:0.0388}\n.ef-p37{--ef-length:58;opacity:0.0422}\n.ef-p38{--ef-length:55.5;opacity:0.0460}\n.ef-p39{--ef-length:53;opacity:0.0503}\n.ef-p40{--ef-length:50.5;opacity:0.0553}\n.ef-p41{--ef-length:48;opacity:0.0612}\n.ef-p42{--ef-length:45.5;opacity:0.0680}\n.ef-p43{--ef-length:43;opacity:0.0762}\n.ef-p44{--ef-length:40.5;opacity:0.0861}\n.ef-p45{--ef-length:38;opacity:0.0984}\n.ef-p46{--ef-length:35.5;opacity:0.1139}\n.ef-p47{--ef-length:33;opacity:0.1342}\n.ef-p48{--ef-length:30.5;opacity:0.1619}\n.ef-p49{--ef-length:28;opacity:0.2016}\n.ef-p50{--ef-length:25.5;opacity:0.3178}\n.ef-p51{--ef-length:22;opacity:0.2831}\n#ef-rain,#ef-heavy,#ef-snow,#ef-flash{display:none}\n#ef-clouds,#ef-fog{opacity:0;transition:opacity 2s}\n#ef-night,#ef-clear,#ef-twilight,#ef-stars,.ef-celestial{opacity:0;transition:opacity .65s ease-out}\n.ef-still #ef-night,.ef-still #ef-clear,.ef-still #ef-twilight,.ef-still #ef-stars,.ef-still .ef-celestial{transition:none}\n.ef:not([data-time=night]) #ef-moon,.ef[data-time=night] #ef-sun{visibility:hidden}\n#ef-glow{opacity:calc(.74 - .39 * var(--ef-darkness,0));transition:opacity .65s ease-out}\n.ef[data-weather=cloudy] #ef-clouds,.ef[data-weather=drizzle] #ef-clouds,.ef[data-weather=heavy] #ef-clouds,.ef[data-weather=fog] #ef-clouds,.ef[data-weather=rain] #ef-clouds,.ef[data-weather=snow] #ef-clouds,.ef[data-weather=storm] #ef-clouds{opacity:1}\n.ef[data-weather=fog] #ef-fog{opacity:1}\n.ef[data-weather=clear] #ef-clear{opacity:calc(1 - var(--ef-darkness,0))}\n.ef[data-weather=clear] #ef-glow{opacity:0}\n#ef-night{opacity:var(--ef-darkness,0)}\n#ef-twilight{opacity:var(--ef-twilight,0)}\n.ef[data-weather=clear] #ef-stars{opacity:var(--ef-starlight,0)}\n.ef[data-weather=rain] #ef-rain,.ef[data-weather=drizzle] #ef-rain,.ef[data-weather=heavy] #ef-rain,.ef[data-weather=heavy] #ef-heavy,.ef[data-weather=storm] #ef-rain,.ef[data-weather=storm] #ef-heavy,.ef[data-weather=storm] #ef-flash{display:inline}\n.ef[data-weather=snow] #ef-snow{display:inline}\n.ef:not(.ef-low):is([data-weather=cloudy],[data-weather=drizzle],[data-weather=heavy],[data-weather=fog],[data-weather=rain],[data-weather=snow],[data-weather=storm]) #ef-drift{animation:ef-drift 150s linear infinite}\n.ef:not(.ef-low)[data-weather=fog] #ef-fog ellipse{animation:ef-sway 46s ease-in-out infinite alternate}\n.ef:not(.ef-low)[data-weather=fog] #ef-fog ellipse+ellipse{animation-duration:61s;animation-direction:alternate-reverse}\n.ef:is([data-weather=rain],[data-weather=drizzle],[data-weather=heavy],[data-weather=storm]) #ef-rain>.ef-streaks:not(#ef-heavy) path{animation:ef-fall 1.2s linear infinite}\n.ef:is([data-weather=heavy],[data-weather=storm]) #ef-heavy path{animation:ef-fall 1.2s linear infinite}\n.ef:not(.ef-low):is([data-weather=rain],[data-weather=drizzle],[data-weather=heavy],[data-weather=storm]) #ef-ripples ellipse{transform-box:fill-box;transform-origin:center;vector-effect:non-scaling-stroke;animation:ef-ripple 2s ease-out infinite}\n.ef[data-weather=snow] #ef-snow circle{animation:ef-snow-a 10s linear infinite}\n.ef[data-weather=snow] #ef-snow .ef-sb{animation-name:ef-snow-b}\n.ef:not(.ef-low)[data-weather=clear][data-time=night] #ef-stars circle{animation:ef-twinkle 4s ease-in-out infinite alternate}\n.ef[data-weather=storm] #ef-flash{animation:ef-flash 7s linear infinite}\n.ef.ef-lite #ef-rain .ef-streaks path:nth-child(2n),.ef.ef-lite #ef-ripples ellipse:nth-child(2n),.ef.ef-lite #ef-snow circle:nth-child(2n){display:none;animation:none}\n.ef.ef-low #ef-rain .ef-streaks path:nth-child(4n+3),.ef.ef-low #ef-snow circle:nth-child(4n+3){display:none;animation:none}\n.ef.ef-low :is(#ef-night,#ef-clear,#ef-twilight,#ef-stars,#ef-glow,#ef-moon,#ef-sun,.ef-garage-lamp,.ef-snowcap){transition:none}\n.ef.ef-low #ef-ripples{display:none}\n.ef[data-weather=drizzle] #ef-rain .ef-streaks path:nth-child(2n),.ef[data-weather=drizzle] #ef-ripples ellipse:nth-child(2n){display:none;animation:none}\n@keyframes ef-flow-beat{from{--ef-beat:0}to{--ef-beat:var(--ef-cycle-distance)}}\n@keyframes ef-grid-beat{from{--ef-beat:0}to{--ef-beat:calc(var(--ef-cycle-distance) * var(--ef-turns,1))}}\n@keyframes ef-drift{to{transform:translateX(1170px)}}\n@keyframes ef-sway{from{transform:translateX(-90px)}to{transform:translateX(90px)}}\n@keyframes ef-fall{to{transform:translateY(1520px)}}\n@keyframes ef-ripple{0%{transform:scale(.15);opacity:0}8%{opacity:.42}55%,100%{transform:scale(1);opacity:0}}\n@keyframes ef-snow-a{to{transform:translate(80px,1460px)}}\n@keyframes ef-snow-b{to{transform:translate(-60px,1460px)}}\n@keyframes ef-twinkle{from{opacity:.25}to{opacity:.95}}\n@keyframes ef-flash{0%,8%,100%{opacity:0}1%{opacity:.5}3%{opacity:.08}4.5%{opacity:.36}}\n.ef-paused,.ef-paused *{animation-play-state:paused!important}\n.ef-restart .ef-flow{animation-name:none}\n.ef-xmas-glow circle,.ef-xmas-bulbs circle,.ef-xmas-bokeh{fill-opacity:0;transition:fill-opacity .12s}\n.ef-xmas-lit:not(.ef-xmas-off) :is(.ef-xmas-glow circle,.ef-xmas-bulbs circle,.ef-xmas-bokeh){fill-opacity:1;transition-delay:calc(var(--i,0) * 24ms)}\n.ef-xmas-off :is(.ef-xmas-glow circle,.ef-xmas-bulbs circle,.ef-xmas-bokeh){transition-delay:calc(var(--i,0) * 16ms)}\n:is(#ef-xmas-tree,.ef-xmas-wire){transition:opacity .6s ease}\n.ef-xmas-off :is(#ef-xmas-tree,.ef-xmas-wire){opacity:0;transition-delay:.9s}\n.ef-still :is(#ef-xmas-tree,.ef-xmas-wire,.ef-xmas-glow circle,.ef-xmas-bulbs circle,.ef-xmas-bokeh,.ef-xmas-wash){transition:none!important}\n@media (prefers-reduced-motion:reduce){.ef,.ef *{animation-play-state:paused!important}#ef-labels text,#ef-labels tspan{transition:none}}\n.ef-no-solar :is(#ef-solar-drop,#ef-solar-label,#ef-solar-lead),\n:is(#ef-solar-label,#ef-solar-lead,#ef-grid-label,#ef-grid-lead){transition:transform .7s cubic-bezier(.3,.7,.2,1),stroke-dashoffset .7s cubic-bezier(.3,.7,.2,1)}\n#ef-grid-lead{stroke-dasharray:60 60;stroke-dashoffset:48}\n.ef:not(.ef-ev-on) :is(#ef-solar-label,#ef-solar-lead){transform:translateX(-99px)}\n.ef-no-b1 :is(#ef-grid-label,#ef-grid-lead){transform:translateX(-135px)}\n.ef-no-b1 #ef-grid-lead{stroke-dashoffset:0}\n.ef-still :is(#ef-solar-label,#ef-solar-lead,#ef-grid-label,#ef-grid-lead){transition:none}\n.ef-no-b1 :is(#ef-b1-battery,#ef-b1-reflection,#ef-l-b1,#ef-b1-label,#ef-b1-lead){display:none}\n.ef-no-b2 :is(#ef-b2-battery,#ef-b2-reflection,#ef-l-b2,#ef-b2-label,#ef-b2-lead){display:none}\n#ef-shutter-slide{transition:transform 1.4s cubic-bezier(.45,0,.25,1) .2s}\n.ef-garage-open #ef-shutter-slide{transform:translateY(-238px);transition-delay:0s}\n#ef-shutter-shade{transition:transform .39s cubic-bezier(.35,0,.7,.2) .2s}\n.ef-garage-open #ef-shutter-shade{transform:translateY(-60px);transition:transform .66s cubic-bezier(.3,.85,.7,1) .74s}\n.ef-baked :is(#ef-garage,#ef-shutter,.ef-open-jamb,.ef-window-wall-bounce){visibility:visible}\n.ef-garage-moving #ef-ev-drop .ef-flow{display:none}\n#ef-ev-lead{transform-origin:102px 796px;transform:scaleY(0);visibility:hidden;\n  transition:transform .18s ease-in .05s,visibility 0s .23s}\n#ef-ev-label{transform-origin:102px 330px;transform:scale(.3);opacity:0;visibility:hidden;\n  transition:transform .18s ease-in,opacity .15s ease-in,visibility 0s .18s}\n.ef-ev-on #ef-ev-lead{transform:none;visibility:visible;transition:transform .32s cubic-bezier(.3,.7,.2,1) 1.15s,visibility 0s 1.15s}\n.ef-ev-on #ef-ev-label{transform:none;opacity:1;visibility:visible;\n  transition:transform .45s cubic-bezier(.3,1.45,.5,1) 1.37s,opacity .2s ease 1.37s,visibility 0s 1.37s}\n#ef-room-dark{opacity:0;transition:opacity .4s ease}\n.ef-lights-off #ef-room-dark{opacity:.94}\n#ef-window-reflection{transition:opacity .4s ease}\n.ef-lights-off #ef-window-reflection{opacity:.03}\n.ef-still :is(#ef-room-dark,#ef-window-reflection){transition:none}\n.ef-tap{fill:transparent;pointer-events:all;cursor:default;-webkit-tap-highlight-color:transparent}\n.ef-relabel :is(#ef-b1-label text,#ef-b2-label text,#ef-grid-name,#ef-grid){\n  transition:transform .55s cubic-bezier(.3,.7,.2,1),fill .42s ease-in-out,filter .42s ease-in-out}\n.ef-ev-on:not(.ef-garage-open) #ef-ev-lead{transition-delay:0s,0s}\n.ef-ev-on:not(.ef-garage-open) #ef-ev-label{transition-delay:.22s,.22s,.22s}\n.ef-still :is(#ef-shutter-slide,#ef-shutter-shade,#ef-ev-lead,#ef-ev-label){transition:none!important}\n@media (prefers-reduced-motion:reduce){:is(#ef-shutter-slide,#ef-shutter-shade,#ef-ev-lead,#ef-ev-label){transition:none!important}}\n.ef-garage-lamp{opacity:calc(.5 + .5 * var(--ef-darkness,0));transition:opacity .65s ease-out}\n.ef-ev-led{fill:#3ddc97}\n.ef-snowcap{fill:#e6ebf1;opacity:0;transition:opacity 1.8s ease}\n.ef[data-weather=snow] .ef-snowcap{opacity:calc(.9 - .45 * var(--ef-darkness,0))}\n.ef-xmas{display:none}\n.ef-christmas .ef-xmas{display:inline}\n.ef-xmas-wire{fill:none;stroke:#1a1a1a;stroke-width:.9}\n.ef-xmas-glow{fill:url(#ef-xmas-warm)}\n.ef-xmas-bulbs circle{fill:#fff4d6}\n.ef-xmas-wash{opacity:0;transition:opacity .4s}\n.ef-xmas-lit:not(.ef-xmas-off) .ef-xmas-wash{opacity:.6;transition-delay:.6s}\n.ef-xmas-room{opacity:calc(.55 + .45 * var(--ef-darkness,0))}\n.ef.ef-christmas.ef-xmas-lit:not(.ef-xmas-off):not(.ef-low) .ef-twinkle{animation:ef-twinkle 2.4s ease-in-out infinite}\n.ef.ef-christmas.ef-xmas-lit:not(.ef-xmas-off):not(.ef-low) .ef-xmas-bokeh{animation-name:ef-glimmer}\n@keyframes ef-twinkle{0%{opacity:1}18%{opacity:.35}30%{opacity:1}52%{opacity:.85}64%{opacity:.15}78%{opacity:1}100%{opacity:1}}\n@keyframes ef-glimmer{0%,100%{opacity:1}40%{opacity:.55}70%{opacity:.9}}\n@media (prefers-reduced-motion:reduce){.ef-twinkle{animation:none}.ef-extra{transition:none!important}}\n.ef-baked .ef-bake{visibility:hidden}\n.ef-frost{opacity:0;transition:opacity 2.4s ease;pointer-events:none}\n.ef-frosty .ef-frost{opacity:calc(var(--ef-frost,1) * (.95 - .4 * var(--ef-darkness,0)))}\n.ef-light{--ef-wall-1:#ededec;--ef-wall-2:#e7e8e8;--ef-gable-1:#c8cad4;--ef-gable-2:#bcbfca;--ef-garage-wall:#bcbfca;--ef-jamb:#5d5f62;--ef-door:#eceef0;--ef-door-line:#cdd0d4;\n  --ef-roof-1:#a3a2ad;--ef-roof-2:#878590;--ef-roof-3:#626674;--ef-roof-back-1:#94979c;--ef-roof-back-2:#8a8d92;\n  --ef-roof-edge:#a4a7ab;--ef-roof-line:#7c7f84;--ef-fascia:#393b42;--ef-roof-ridge:#b8bbbf;\n  --ef-grid-color:#8a9097}\n.ef-light #ef-sky stop:nth-child(1){stop-color:#c9d0d8}\n.ef-light #ef-sky stop:nth-child(2){stop-color:#d1d7de}\n.ef-light #ef-sky stop:nth-child(3){stop-color:#d8dde3}\n.ef-light #ef-sky stop:nth-child(4){stop-color:#dde1e6}\n.ef-light #ef-sky stop:nth-child(5){stop-color:#e3e6ea}\n.ef-light #ef-sky stop:nth-child(6){stop-color:#e8eaed}\n.ef-light #ef-sky stop:nth-child(7){stop-color:#ebedf0}\n.ef-light #ef-sky stop:nth-child(8){stop-color:#eff1f3}\n.ef-light #ef-sky stop:nth-child(9){stop-color:#f2f3f5}\n.ef-light #ef-sky stop:nth-child(10){stop-color:#f4f5f6}\n.ef-light #ef-sun circle:nth-child(1){opacity:.85}\n.ef-light #ef-sun circle:nth-child(2){opacity:.85;transform:scale(1.3)}\n.ef-light #ef-sun circle:nth-child(3){transform:scale(1.2)}\n.ef-light #ef-clear-g stop:nth-child(1){stop-color:#6b9fe0;stop-opacity:.78}\n.ef-light #ef-clear-g stop:nth-child(2){stop-color:#98c2ef;stop-opacity:.5}\n.ef-light #ef-clear-g stop:nth-child(3){stop-color:#9cc6f0}\n.ef-light #ef-grid-fade stop{stop-color:#f2f3f5}\n.ef-light .ef-grid-pipe{mask:url(#ef-grid-fade-mask)}\n.ef-light #ef-grid-end{opacity:0}\n.ef-light.ef-masking #ef-grid-end{opacity:1;stroke-width:34}\n.ef-light [fill=\"url(#ef-gable-shade)\"]{opacity:.16}\n.ef-light{--ef-door-seam-width:2}\n.ef-light [style*=\"--ef-roof-ridge\"]{stroke-opacity:.52}\n.ef-light [fill=\"url(#ef-roof)\"]{fill:url(#ef-roof-enamel)}\n.ef-light :is(#ef-b1-battery,#ef-b2-battery){filter:drop-shadow(-3px 2.4px 2.4px rgb(16 17 24/.26))}\n.ef-light #ef-ev-charger .ef-ev-led{fill:#4ae862}\n.ef-light{--ef-b1-strip-1:#a6fa9c;--ef-b1-strip-2:#52d85e;--ef-b2-strip-1:#82dcff;--ef-b2-strip-2:#2294f8}\n.ef-light #ef-garage-wall-right stop{stop-color:#15171c}.ef-light #ef-garage-wall-right stop:last-child{stop-opacity:.6}\n.ef-light[data-time=night]:not(.ef-lights-off) #ef-garage-wall-right stop:last-child{stop-color:#150f0a;stop-opacity:.46}\n.ef-light #ef-ev-body stop:nth-child(2){stop-color:#262830}\n.ef-light #ef-ev-charger{filter:drop-shadow(-1.8px 2.4px 1.8px rgb(10 11 15/.34))}\n.ef-light #ef-ev-face stop:first-child{stop-color:#676a71}.ef-light #ef-ev-face stop:last-child{stop-color:#45474e}\n.ef-light[data-time=night] #ef-garage-floor stop:first-child{stop-color:#92806e}\n.ef-light #ef-b1-body{--ef-b1-body-side:#626674;--ef-b1-body-top:#f1f2f5;--ef-b1-body-rim:#e8eaf0}\n.ef-light[data-time=night] #ef-b1-body{--ef-b1-body-side:#585f74}\n.ef:not(.ef-garage-open) .ef-open-jamb{display:none}\n.ef-light.ef-garage-open #ef-shutter-slide{transform:translateY(-236.5px)}\n.ef-light #ef-b2-body{--ef-b2-body-top:#474a54;--ef-b2-body-rim:#9ea2b0;--ef-b2-body-side:#18191f}\n.ef-light [fill=\"#141414\"]{fill:url(#ef-window-casing)}\n.ef-light [fill=\"#0c0c0c\"]{fill:#303237}\n.ef-light[data-time=night] #ef-eave-shade stop:first-child{stop-color:#131b3a;stop-opacity:.78}\n.ef-light[data-time=night] #ef-eave-shade stop:nth-child(2){stop-color:#1c2648;stop-opacity:.42}\n.ef-light{--ef-plinth-end:#6c6e74;--ef-plinth-shade:#606268;--ef-plinth-shadow:#585a60;--ef-plinth-mid:#6e7076;--ef-plinth-jamb:#5c5f68;--ef-plinth-side:#6c707a}\n.ef-light[data-time=night]{--ef-plinth-end:#474a52;--ef-plinth-shade:#41444d;--ef-plinth-shadow:#3a3d46;--ef-plinth-mid:#474a52;--ef-plinth-jamb:#363942;--ef-plinth-side:#41444d}\n.ef-light[data-time=night] #ef-rake-metal stop:nth-child(1){stop-color:#546286}\n.ef-light[data-time=night] #ef-rake-metal stop:nth-child(2){stop-color:#68779c}\n.ef-light[data-time=night] #ef-rake-metal stop:nth-child(3){stop-color:#445173}\n.ef-light[data-time=night] #ef-fascia-metal stop:nth-child(1){stop-color:#606f94}\n.ef-light[data-time=night] #ef-fascia-metal stop:nth-child(2){stop-color:#4a587c}\n.ef-light[data-time=night] #ef-fascia-metal stop:nth-child(3){stop-color:#3f4d70}\n.ef-light[data-time=night] #ef-fascia-metal stop:nth-child(4){stop-color:#2c3754}\n.ef-light{--ef-slab-near:#c5cbd8;--ef-slab-mid:#e0e6f3;--ef-slab-far:#dfe6f5}\n.ef-light[data-time=night]{--ef-slab-near:#90a0cf;--ef-slab-mid:#b4c4eb;--ef-slab-far:#a9bce8}\n#ef-car [fill=\"url(#ef-car-shade)\"]{opacity:.95}\n#ef-car [stroke=\"#d3262f\"]{stroke:#ff2d24;stroke-width:1.0;filter:drop-shadow(0 0 .7px rgb(255 45 36/.55))}\n#ef-car [stroke=\"#7b8084\"]{stroke-opacity:.04}\n#ef-car-lip stop:nth-child(1){stop-color:#0d0e11}\n#ef-car-lip stop:nth-child(2){stop-color:#16171c}\n#ef-car-lip stop:nth-child(3){stop-color:#08090c}\n#ef-car-recess stop:nth-child(1){stop-color:#0b0c0f}\n#ef-car-recess stop:nth-child(2){stop-color:#14151a}\n#ef-car-recess stop:nth-child(3){stop-color:#1d1e24}\n.ef-light.ef-lights-off [fill=\"url(#ef-pane)\"]{fill:#30323a}\n.ef-light.ef-lights-off[data-time=night] [fill=\"url(#ef-pane)\"]{fill:#101216}\n.ef:not(.ef-lights-off){--ef-cabin-tint:calc(var(--ef-darkness,0)*100%)}\n#ef-painted-hatch{stroke-opacity:.58}\n#ef-back-windscreen{stroke-opacity:.28}\n#ef-car [fill=\"#fff\"][opacity=\".06\"]{opacity:.085}\n.ef-light #ef-meter-face stop:nth-child(1){stop-color:#d9dbde}\n.ef-light #ef-meter-face stop:nth-child(2){stop-color:#c9cbce}\n.ef-light #ef-meter-face stop:nth-child(3){stop-color:#b9bbbe}\n.ef-light #ef-meter-side stop:nth-child(1){stop-color:#a9abae}\n.ef-light #ef-meter-side stop:nth-child(2){stop-color:#96989b}\n.ef-light [fill=\"#6d6d6f\"]{fill:#b2b4b7}\n.ef-light[data-time=night]:not(.ef-lights-off) #ef-ev-face stop:first-child{stop-color:#f6e2c8}\n.ef-light[data-time=night]:not(.ef-lights-off) #ef-ev-face stop:last-child{stop-color:#d0b89c}\n.ef-light #ef-garage-lintel-shade stop:nth-child(1){stop-opacity:.22}\n#ef-car-plate stop:first-child{stop-color:#b8bdc6}\n#ef-car-plate stop:last-child{stop-color:#9ea3ac}\n.ef[data-time=night]:not(.ef-lights-off) #ef-car-plate stop:first-child{stop-color:#b8b1a9}\n.ef[data-time=night]:not(.ef-lights-off) #ef-car-plate stop:last-child{stop-color:#9e9790}\n#ef-car [stroke=\"#7d8286\"]{stroke-opacity:.32}\n#ef-car [stroke=\"#16181a\"][stroke-width=\".55\"]{stroke:#2b2e3a}\n#ef-car [fill=\"url(#ef-car-glow)\"]{opacity:.95}\n#ef-car [stroke=\"#16181a\"][stroke-width=\".55\"]{stroke-opacity:.22}\n.ef-light #ef-ev-charger{transform:matrix(.96,-.213,0,.92,46,789.5)}\n.ef-light #ef-ev-body stop:first-child{stop-color:#3a3c44}\n.ef-light[data-time=night]:not(.ef-lights-off) #ef-ev-body stop:first-child{stop-color:#4a3b2f}\n.ef-light[data-time=night]:not(.ef-lights-off) #ef-ev-body stop:nth-child(2){stop-color:#2b221a}\n.ef-light .ef-jamb-l{fill:#7b7d84}\n.ef-light .ef-jamb-r{fill:#5d606a}\n.ef-light #ef-garage-side stop:nth-child(1){stop-color:#848284}\n.ef-light #ef-garage-side stop:nth-child(2){stop-color:#6d6c71}\n.ef-light #ef-garage-floor stop:nth-child(1){stop-color:#6c6d74}\n.ef-light #ef-garage-floor stop:nth-child(2){stop-color:#94959c}\n.ef-light #ef-garage [stroke=\"#0b0b0c\"]{stroke:#8d9198}\n.ef-light #ef-garage-slat stop:nth-child(1){stop-color:#d8dadd}\n.ef-light #ef-garage-slat stop:nth-child(2){stop-color:#c4c6c9}\n.ef-light #ef-garage-slat stop:nth-child(3){stop-color:#a9abaf}\n.ef-light .ef-cap{fill:#45484d}\n.ef-light .ef-val{fill:#1b1c1e}\n.ef-light .ef-idle{fill:#5b5e63}\n.ef-light #ef-labels text{filter:drop-shadow(1.5px 1.5px .6px #fff)}\n.ef-light .ef-extra-name{color:#55595f}\n.ef-light .ef-extra-val{color:#1b1c1e}\n.ef-light .ef-extra span{text-shadow:1.2px 1.2px .5px #fff}\n.ef-light .ef-extra.ef-extra-edge .ef-extra-name{color:rgb(85 89 95/.3)}\n.ef-light .ef-extra.ef-extra-edge .ef-extra-val{color:rgb(27 28 30/.3)}\n.ef-light .ef-extra.ef-extra-edge span{text-shadow:none}\n.ef-light .ef-lead{stroke:#3a3d42;stroke-opacity:.5}\n.ef-light :is(#ef-solar-lead,#ef-home-lead,#ef-ev-lead){stroke:#fff;stroke-opacity:.82}\n.ef-light :is(.ef-lane,.ef-drop-pipe){stroke:#c4c7cb}\n.ef-light .ef-pipe-shade,.ef-light path[stroke=\"#000\"][stroke-width=\"4.2\"][transform]{stroke:#2a2f3c;stroke-opacity:.16}\n.ef-light .ef-line .ef-lane{stroke:#c4c7cb;stroke-opacity:1}\n.ef-light .ef-line .ef-pipe-shade{stroke:#fff;stroke-opacity:calc(.7 - .5 * var(--ef-darkness,0))}\n.ef-light #ef-rain{stroke:#4f5964}\n.ef-light :is(.ef-lane,.ef-drop-pipe),.ef-light[data-time=night] :is(.ef-lane,.ef-drop-pipe){stroke-opacity:.88}\n.ef-light .ef-line .ef-lane,.ef-light[data-time=night] .ef-line .ef-lane{stroke-opacity:.6}\n.ef-light #ef-snow{stroke:#8d97a2;stroke-width:.8;stroke-opacity:.55}\n.ef-light{--ef-window-1:#ecd3a0;--ef-window-2:#d9b77c;--ef-window-mirror:#f5e1c8}\n.ef-light[data-time=night]{--ef-window-1:#fad082;--ef-window-2:#eba758;--ef-window-mirror:#ffe2ba}\n.ef-light.ef-lights-off:not([data-time=night]){--ef-window-1:#908e87;--ef-window-2:#84827c;--ef-window-mirror:#898780}\n.ef-light{--ef-n-wall:#7288cc;--ef-n-wall-p:33%;--ef-n-roof:#3f558c;--ef-n-roof-p:48%;--ef-n-door:#8e9cc4;--ef-n-door-p:26%;\n  --ef-n-sky:#94a9dc;--ef-n-sky-p:78%}\n.ef-light:is([data-weather=cloudy],[data-weather=fog],[data-weather=drizzle],[data-weather=rain],[data-weather=heavy],[data-weather=snow],[data-weather=storm]){--ef-n-wall:#6f768b;--ef-n-wall-p:40%;--ef-n-roof:#262b3a;--ef-n-roof-p:62%;--ef-n-door:#434959;--ef-n-door-p:64%;\n  --ef-n-sky:#e0e3ec;--ef-n-sky-p:60%}\n.ef-light #ef-night-g stop:nth-child(1){stop-color:#0f2457;stop-opacity:.95}\n.ef-light #ef-night-g stop:nth-child(2){stop-color:#4c68b4;stop-opacity:.46}\n.ef-light #ef-night-g stop:nth-child(3){stop-color:#93a8dc}\n.ef-light:is([data-weather=cloudy],[data-weather=fog],[data-weather=drizzle],[data-weather=rain],[data-weather=heavy],[data-weather=snow],[data-weather=storm]) #ef-night-g stop:nth-child(1){stop-color:#3c4866;stop-opacity:.95}\n.ef-light:is([data-weather=cloudy],[data-weather=fog],[data-weather=drizzle],[data-weather=rain],[data-weather=heavy],[data-weather=snow],[data-weather=storm]) #ef-night-g stop:nth-child(2){stop-color:#9399ab;stop-opacity:.42}\n.ef-light:is([data-weather=cloudy],[data-weather=fog],[data-weather=drizzle],[data-weather=rain],[data-weather=heavy],[data-weather=snow],[data-weather=storm]) #ef-night-g stop:nth-child(3){stop-color:#aab0c1}\n.ef-light[data-time=night] .ef-lead{stroke:#fff;stroke-opacity:.75}\n.ef-light[data-time=night]:is([data-weather=cloudy],[data-weather=fog],[data-weather=drizzle],[data-weather=rain],[data-weather=heavy],[data-weather=snow],[data-weather=storm]) .ef-lead{stroke:#3a3d45;stroke-opacity:.55}\n.ef-light[data-time=night]:is([data-weather=cloudy],[data-weather=fog],[data-weather=drizzle],[data-weather=rain],[data-weather=heavy],[data-weather=snow],[data-weather=storm]) :is(.ef-lane,.ef-line .ef-lane,.ef-drop-pipe){stroke:#7e8393}\n.ef-light[data-time=night]:is([data-weather=cloudy],[data-weather=fog],[data-weather=drizzle],[data-weather=rain],[data-weather=heavy],[data-weather=snow],[data-weather=storm]) #ef-meter-face stop:nth-child(1){stop-color:#9a9eaa}\n.ef-light[data-time=night]:is([data-weather=cloudy],[data-weather=fog],[data-weather=drizzle],[data-weather=rain],[data-weather=heavy],[data-weather=snow],[data-weather=storm]) #ef-meter-face stop:nth-child(2){stop-color:#8a8e9a}\n.ef-light[data-time=night]:is([data-weather=cloudy],[data-weather=fog],[data-weather=drizzle],[data-weather=rain],[data-weather=heavy],[data-weather=snow],[data-weather=storm]) #ef-meter-face stop:nth-child(3){stop-color:#7b7f8b}\n.ef-light[data-time=night]:is([data-weather=cloudy],[data-weather=fog],[data-weather=drizzle],[data-weather=rain],[data-weather=heavy],[data-weather=snow],[data-weather=storm]) #ef-meter-side stop{stop-color:#646875}\n.ef-light[data-time=night]:is([data-weather=cloudy],[data-weather=fog],[data-weather=drizzle],[data-weather=rain],[data-weather=heavy],[data-weather=snow],[data-weather=storm]) [fill=\"#6d6d6f\"]{fill:#80848f}\n.ef-light[data-time=night]:is([data-weather=cloudy],[data-weather=fog],[data-weather=drizzle],[data-weather=rain],[data-weather=heavy],[data-weather=snow],[data-weather=storm]) #ef-garage-slat stop:nth-child(1){stop-color:#7a8090}\n.ef-light[data-time=night]:is([data-weather=cloudy],[data-weather=fog],[data-weather=drizzle],[data-weather=rain],[data-weather=heavy],[data-weather=snow],[data-weather=storm]) #ef-garage-slat stop:nth-child(2){stop-color:#6a7080}\n.ef-light[data-time=night]:is([data-weather=cloudy],[data-weather=fog],[data-weather=drizzle],[data-weather=rain],[data-weather=heavy],[data-weather=snow],[data-weather=storm]) #ef-garage-slat stop:nth-child(3){stop-color:#555a68}\n@supports (color:color-mix(in srgb,red,blue 10%)){\n.ef-light{--ef-moonlit:calc(var(--ef-darkness,0) * var(--ef-n-wall-p));--ef-moonroof:calc(var(--ef-darkness,0) * var(--ef-n-roof-p));\n  --ef-moondoor:calc(var(--ef-darkness,0) * var(--ef-n-door-p));--ef-moonsky:calc(var(--ef-darkness,0) * var(--ef-n-sky-p));\n  --ef-wall-1:color-mix(in srgb,#eeefee,var(--ef-n-wall) var(--ef-moonlit));--ef-wall-2:color-mix(in srgb,#e7e7e6,var(--ef-n-wall) var(--ef-moonlit));--ef-gable-1:color-mix(in srgb,#c2c5d3,var(--ef-n-wall) var(--ef-moonlit));--ef-gable-2:color-mix(in srgb,#b6bac8,var(--ef-n-wall) var(--ef-moonlit));--ef-garage-wall:color-mix(in srgb,#b7bbc9,var(--ef-n-wall) var(--ef-moonlit));--ef-jamb:color-mix(in srgb,#555860,var(--ef-n-wall) var(--ef-moonlit));\n  --ef-door:color-mix(in srgb,#eceef0,var(--ef-n-door) var(--ef-moondoor));--ef-door-line:color-mix(in srgb,#cdd0d4,var(--ef-n-door) var(--ef-moondoor));\n  --ef-roof-1:color-mix(in srgb,#5e6577,var(--ef-n-roof) var(--ef-moonroof));--ef-roof-2:color-mix(in srgb,#818696,var(--ef-n-roof) var(--ef-moonroof));--ef-roof-3:color-mix(in srgb,#7f8496,var(--ef-n-roof) var(--ef-moonroof));--ef-roof-back-1:color-mix(in srgb,#6d788e,var(--ef-n-roof) var(--ef-moonroof));--ef-roof-back-2:color-mix(in srgb,#979ba8,var(--ef-n-roof) var(--ef-moonroof));--ef-roof-edge:color-mix(in srgb,#6a7892,var(--ef-n-roof) var(--ef-moonroof));--ef-roof-line:color-mix(in srgb,#4a4948,var(--ef-n-roof) var(--ef-moonroof));--ef-fascia:color-mix(in srgb,#393b42,var(--ef-n-roof) var(--ef-moonroof));--ef-roof-ridge:color-mix(in srgb,#8c9ab4,var(--ef-n-roof) var(--ef-moonroof))}\n.ef-light #ef-garage-side stop:nth-child(1){stop-color:color-mix(in srgb,#757376,var(--ef-n-door) var(--ef-moondoor))}\n.ef-light #ef-garage-side stop:nth-child(2){stop-color:color-mix(in srgb,#5c5b60,var(--ef-n-door) var(--ef-moondoor))}\n.ef-light #ef-garage-floor stop:nth-child(1){stop-color:color-mix(in srgb,#53545b,var(--ef-n-door) var(--ef-moondoor))}\n.ef-light #ef-garage-floor stop:nth-child(2){stop-color:color-mix(in srgb,#777880,var(--ef-n-door) var(--ef-moondoor))}\n.ef-light #ef-sky stop:nth-child(1){stop-color:color-mix(in srgb,#c9d0d8,var(--ef-n-sky) var(--ef-moonsky))}\n.ef-light #ef-sky stop:nth-child(2){stop-color:color-mix(in srgb,#d1d7de,var(--ef-n-sky) var(--ef-moonsky))}\n.ef-light #ef-sky stop:nth-child(3){stop-color:color-mix(in srgb,#d8dde3,var(--ef-n-sky) var(--ef-moonsky))}\n.ef-light #ef-sky stop:nth-child(4){stop-color:color-mix(in srgb,#dde1e6,var(--ef-n-sky) var(--ef-moonsky))}\n.ef-light #ef-sky stop:nth-child(5){stop-color:color-mix(in srgb,#c4d5ee,var(--ef-n-sky) var(--ef-moonsky))}\n.ef-light #ef-sky stop:nth-child(6){stop-color:color-mix(in srgb,#cbd9ee,var(--ef-n-sky) var(--ef-moonsky))}\n.ef-light #ef-sky stop:nth-child(7){stop-color:color-mix(in srgb,#d3d8e3,var(--ef-n-sky) var(--ef-moonsky))}\n.ef-light #ef-sky stop:nth-child(8){stop-color:color-mix(in srgb,#dadde7,var(--ef-n-sky) var(--ef-moonsky))}\n.ef-light #ef-sky stop:nth-child(9){stop-color:color-mix(in srgb,#dde0e8,var(--ef-n-sky) var(--ef-moonsky))}\n.ef-light #ef-sky stop:nth-child(10){stop-color:color-mix(in srgb,#dfe1e8,var(--ef-n-sky) var(--ef-moonsky))}\n}\n.ef-light-only,.ef-light .ef-dark-only{display:none}\n.ef-light #ef-drift{opacity:calc(1 - .6 * var(--ef-darkness,0))}\n.ef-light #ef-night{transform:scaleY(.84)}\n.ef-light #ef-b1-reflection{clip-path:url(#ef-b1-floor)}\n.ef-light #ef-b2-reflection{clip-path:url(#ef-b2-floor)}\n.ef-light #ef-window-reflection>g{filter:url(#ef-reflection-soft)}\n.ef.ef-light .ef-light-only{display:inline}\n.ef-light #ef-shadow{display:none}\n.ef-light .ef-reflection{opacity:.18}\n.ef-light :is(#ef-b1-reflection,#ef-b2-reflection){opacity:calc(.40 + .24 * var(--ef-darkness,0))}\n.ef-light :is(#ef-b1-reflection,#ef-b2-reflection)>g:first-child{opacity:.95}\n.ef-light #ef-b1-battery>path[fill=\"#fff\"]{opacity:.34}\n.ef-light #ef-b2-battery>path[fill=\"#fff\"]{opacity:.075}\n.ef-light .ef-garage-wash{opacity:calc(.02 + .92 * var(--ef-darkness,0))}\n.ef-light #ef-garage-side stop:first-child{stop-color:#93949a}\n.ef-light #ef-garage-side stop:last-child{stop-color:#74757a}\n.ef-light #ef-garage-floor stop:first-child{stop-color:#797a82}\n.ef-light #ef-garage-floor stop:last-child{stop-color:#9b9ca4}\n.ef-light #ef-garage [stroke=\"#0b0b0c\"]{stroke:#5e5e66}\n.ef-light[data-time=night]:not(.ef-lights-off) #ef-garage-floor stop:first-child{stop-color:#7a6c60}\n.ef-light[data-time=night]:not(.ef-lights-off) #ef-garage-floor stop:last-child{stop-color:#bfab94}\n.ef-light[data-time=night]:not(.ef-lights-off) #ef-garage-side stop:first-child{stop-color:#d0ae82}\n.ef-light[data-time=night]:not(.ef-lights-off) #ef-garage-side stop:last-child{stop-color:#8a6a4c}\n.ef-light .ef-garage-lamp{opacity:calc(.12 + .88 * var(--ef-darkness,0))}\n.ef-light.ef-lights-off .ef-garage-lamp{opacity:0}\n.ef-light .ef-garage-spill{opacity:0;transition:opacity 1.4s cubic-bezier(.45,0,.25,1) .2s}\n.ef-light.ef-garage-open .ef-garage-spill{opacity:1;transition-delay:0s}\n.ef-still .ef-garage-spill{transition:none}\n.ef-light.ef-lights-off :is(.ef-garage-wash,.ef-garage-spill,.ef-pane-spill,.ef-pane-glow,.ef-window-wall-bounce){display:none}\n.ef-light .ef-pane-glow{opacity:calc(.94 + .06 * var(--ef-darkness,0))}\n.ef-light #ef-window-reflection{opacity:0}\n.ef-light[data-time=night] #ef-window-reflection{opacity:0}\n.ef-light{--ef-b1-face-1:#dfe1e6;--ef-b1-face-2:#cfd2da;--ef-b2-face-1:#2e3037;--ef-b2-face-2:#1b1d23;--ef-b2-mirror:#3d404c}\n.ef-light[data-time=night]{--ef-b1-face-1:#ced2e2;--ef-b1-face-2:#bcc1d5;--ef-b2-face-1:#30333e;--ef-b2-face-2:#1d1f29;--ef-b2-mirror:#363a48}\n.ef-no-b1 #ef-b1-wall-shadow,.ef-no-b2 #ef-b2-wall-shadow{display:none}\n.ef-light :is(#ef-b1-reflection,#ef-b2-reflection)>g.ef-light-only{opacity:1}\n.ef-no-b1 .ef-b1-contact,.ef-no-b2 .ef-b2-contact{display:none}\n.ef-no-solar .ef-solar-wall-shadow{display:none}\n.ef-light :is(#ef-window-reflection-fade,#ef-b1-reflection-fade,#ef-b2-reflection-fade) stop:nth-child(2){stop-opacity:.56}\n.ef-light :is(#ef-b1-reflection-fade,#ef-b2-reflection-fade) stop:nth-child(2){stop-opacity:calc(.56 + .18 * var(--ef-darkness,0))}\n.ef-light #ef-window-reflection-fade stop:nth-child(3){stop-opacity:.12}\n#ef-window-spill{opacity:0}\n.ef-light{--ef-room-dark-d:path(\"M769.5 743.5 837.5 728.88 837.5 787.28 769.5 801.9ZM851.5 725.87 919 711.3575 919 769.7575 851.5 784.27ZM769.5 814.1 837.5 799.48 837.5 858.18 769.5 872.8ZM851.5 796.47 919 781.9575 919 840.6575 851.5 855.17Z\")}\n#ef-b1-glow{opacity:calc(.25 + .6 * var(--ef-darkness,0))}\n.ef-light #ef-b1-glow{opacity:calc(.08 + .26 * var(--ef-darkness,0))}\n.ef-light #ef-b2-glow{opacity:calc(.06 + .20 * var(--ef-darkness,0))}\n.ef-light #ef-b1-spill{opacity:calc(.18 + .30 * var(--ef-darkness,0))}\n.ef-light #ef-b2-spill{opacity:calc(.16 + .30 * var(--ef-darkness,0))}\n.ef-lights-off #ef-window-spill,.ef-no-b1 :is(#ef-b1-spill,#ef-b1-ao,#ef-b1-glow,#ef-b1-plinth-bounce),.ef-no-b2 :is(#ef-b2-ao,#ef-b2-glow,#ef-b2-spill,#ef-b2-plinth-bounce){display:none}\n.ef-light #ef-window-reflection{clip-path:url(#ef-floor-plane)}\n.ef-light.ef-lights-off #ef-window-reflection{display:none}\n.ef-light{--ef-room-dark-d:path(\"M770.5 744.3075 836.5 730.1175 836.5 786.4175 770.5 800.6075ZM852.5 726.6775 918 712.595 918 768.895 852.5 782.9775ZM770.5 815.6075 836.5 801.4175 836.5 857.6175 770.5 871.8075ZM852.5 797.9775 918 783.895 918 840.095 852.5 854.1775Z\")}\n.ef-light.ef-lights-off #ef-room-dark{opacity:1;fill:#30323a}\n.ef-light.ef-lights-off[data-time=night] #ef-room-dark{fill:#101216}\n.ef-light.ef-lights-off .ef-sash{stroke:#babec6 !important;opacity:.88}\n.ef-light.ef-lights-off[data-time=night] .ef-sash{stroke:#2b2e35 !important;opacity:.38}\n.ef-light.ef-lights-off .ef-sash2{stroke:#cfc8bc !important}\n.ef-light.ef-lights-off[data-time=night] .ef-sash2{stroke:#2b2e35 !important}\n.ef.ef-light.ef-lights-off .ef-warm-bead{display:none}\n.ef-light.ef-lights-off #ef-pane-reveal stop:first-child{stop-color:#222429}\n.ef-light.ef-lights-off[data-time=night] #ef-pane-reveal stop:first-child{stop-color:#0d0f12}\n.ef-light.ef-lights-off #ef-pane-reveal stop:nth-child(2){stop-color:#40434a}\n.ef-light.ef-lights-off[data-time=night] #ef-pane-reveal stop:nth-child(2){stop-color:#16181d}\n.ef-light.ef-lights-off #ef-pane-reveal stop:last-child{stop-color:#55575e}\n.ef-light.ef-lights-off[data-time=night] #ef-pane-reveal stop:last-child{stop-color:#1c1e24}\n.ef-light.ef-lights-off:not([data-time=night]) [fill=\"#141414\"]{fill:#7a7b79}\n.ef-light.ef-lights-off:not([data-time=night]) [fill=\"#0c0c0c\"]{fill:#727472}\n.ef{--ef-b1-body-top:#2b2d31;--ef-b1-body-rim:#585b61;--ef-b1-body-side:#161616;--ef-b2-body-top:#2d2f33;--ef-b2-body-rim:#5a5d63;--ef-b2-body-side:#18191b}\n.ef-light{--ef-b1-body-top:#d3d7df;--ef-b1-body-rim:#e3e6eb;--ef-b1-body-side:#737988;--ef-b2-body-top:#b4b8c1;--ef-b2-body-rim:#c9ccd3;--ef-b2-body-side:#5d6270}\n@supports (color:color-mix(in srgb,red,blue 10%)){\n.ef-light #ef-b1-body{--ef-b1-body-side:color-mix(in srgb,#626674,#585f74 calc(var(--ef-darkness,0)*100%))}\n.ef-light{--ef-plinth-end:color-mix(in srgb,#6c6e74,#474a52 calc(var(--ef-darkness,0)*100%));--ef-plinth-shade:color-mix(in srgb,#606268,#41444d calc(var(--ef-darkness,0)*100%));--ef-plinth-shadow:color-mix(in srgb,#585a60,#3a3d46 calc(var(--ef-darkness,0)*100%));--ef-plinth-mid:color-mix(in srgb,#6e7076,#474a52 calc(var(--ef-darkness,0)*100%));--ef-plinth-jamb:color-mix(in srgb,#5c5f68,#363942 calc(var(--ef-darkness,0)*100%));--ef-plinth-side:color-mix(in srgb,#6c707a,#41444d calc(var(--ef-darkness,0)*100%));\n  --ef-slab-near:color-mix(in srgb,#c5cbd8,#90a0cf calc(var(--ef-darkness,0)*100%));--ef-slab-mid:color-mix(in srgb,#e0e6f3,#b4c4eb calc(var(--ef-darkness,0)*100%));--ef-slab-far:color-mix(in srgb,#dfe6f5,#a9bce8 calc(var(--ef-darkness,0)*100%));\n  --ef-window-1:color-mix(in srgb,#ecd3a0,#fad082 calc(var(--ef-darkness,0)*100%));--ef-window-2:color-mix(in srgb,#d9b77c,#eba758 calc(var(--ef-darkness,0)*100%));--ef-window-mirror:color-mix(in srgb,#f5e1c8,#ffe2ba calc(var(--ef-darkness,0)*100%));\n  --ef-b1-face-1:color-mix(in srgb,#dfe1e6,#ced2e2 calc(var(--ef-darkness,0)*100%));--ef-b1-face-2:color-mix(in srgb,#cfd2da,#bcc1d5 calc(var(--ef-darkness,0)*100%));--ef-b2-face-1:color-mix(in srgb,#2e3037,#30333e calc(var(--ef-darkness,0)*100%));--ef-b2-face-2:color-mix(in srgb,#1b1d23,#1d1f29 calc(var(--ef-darkness,0)*100%));--ef-b2-mirror:color-mix(in srgb,#3d404c,#363a48 calc(var(--ef-darkness,0)*100%))}\n.ef-light.ef-lights-off:not([data-time=night]){--ef-window-1:#908e87;--ef-window-2:#84827c;--ef-window-mirror:#898780}\n.ef-top{stroke:color-mix(in srgb,var(--ef-flow-color,var(--ef-source-color)) 80%,#fff)}\n.ef-light.ef-lights-off [fill=\"url(#ef-pane)\"]{fill:color-mix(in srgb,#30323a,#101216 calc(var(--ef-darkness,0)*100%))}\n.ef-light.ef-lights-off #ef-room-dark{fill:color-mix(in srgb,#30323a,#101216 calc(var(--ef-darkness,0)*100%))}\n.ef-light.ef-lights-off .ef-sash{stroke:color-mix(in srgb,#babec6,#2b2e35 calc(var(--ef-darkness,0)*100%)) !important;opacity:calc(.88 - .5 * var(--ef-darkness,0))}\n.ef-light.ef-lights-off .ef-sash2{stroke:color-mix(in srgb,#cfc8bc,#2b2e35 calc(var(--ef-darkness,0)*100%)) !important}\n.ef-light.ef-lights-off #ef-pane-reveal stop:first-child{stop-color:color-mix(in srgb,#222429,#0d0f12 calc(var(--ef-darkness,0)*100%))}\n.ef-light.ef-lights-off #ef-pane-reveal stop:nth-child(2){stop-color:color-mix(in srgb,#40434a,#16181d calc(var(--ef-darkness,0)*100%))}\n.ef-light.ef-lights-off #ef-pane-reveal stop:last-child{stop-color:color-mix(in srgb,#55575e,#1c1e24 calc(var(--ef-darkness,0)*100%))}\n.ef-pv-skylight{opacity:calc(1 - .90 * var(--ef-darkness,0))}\n.ef-pv-cell-detail{opacity:calc(.86 - .46 * var(--ef-darkness,0))}\n#ef-slab-right-tint stop:nth-child(2){stop-color:color-mix(in srgb,#d2dff6,#90aae3 calc(var(--ef-darkness,0)*100%))}\n#ef-slab-right-tint stop:nth-child(3){stop-color:color-mix(in srgb,#d8e4f8,#88a3e0 calc(var(--ef-darkness,0)*100%))}\n#ef-ground-sheen-r stop:nth-child(1){stop-color:color-mix(in srgb,#f4f7ff,#d6e3ff calc(var(--ef-darkness,0)*100%))}\n#ef-ground-sheen-r stop:nth-child(2){stop-color:color-mix(in srgb,#eef2fc,#ccd9fb calc(var(--ef-darkness,0)*100%))}\n#ef-window-mirror-a stop:nth-child(1){stop-color:color-mix(in srgb,#f6e2c4,#fbe0bc calc(var(--ef-darkness,0)*100%))}\n#ef-window-mirror-a stop:nth-child(2){stop-color:color-mix(in srgb,#f6e2c4,#fbe0bc calc(var(--ef-darkness,0)*100%))}\n#ef-window-mirror-a stop:nth-child(3){stop-color:color-mix(in srgb,#f6e2c4,#fbe0bc calc(var(--ef-darkness,0)*100%))}\n#ef-window-mirror-a stop:nth-child(4){stop-color:color-mix(in srgb,#f6e2c4,#fbe0bc calc(var(--ef-darkness,0)*100%))}\n#ef-window-mirror-b stop:nth-child(1){stop-color:color-mix(in srgb,#f6e2c4,#fbe0bc calc(var(--ef-darkness,0)*100%))}\n#ef-window-mirror-b stop:nth-child(2){stop-color:color-mix(in srgb,#f6e2c4,#fbe0bc calc(var(--ef-darkness,0)*100%))}\n#ef-window-mirror-b stop:nth-child(3){stop-color:color-mix(in srgb,#f6e2c4,#fbe0bc calc(var(--ef-darkness,0)*100%))}\n#ef-window-mirror-b stop:nth-child(4){stop-color:color-mix(in srgb,#f6e2c4,#fbe0bc calc(var(--ef-darkness,0)*100%))}\n#ef-window-mirror-c stop:nth-child(1){stop-color:color-mix(in srgb,#f6e2c4,#fbe0bc calc(var(--ef-darkness,0)*100%))}\n#ef-window-mirror-c stop:nth-child(2){stop-color:color-mix(in srgb,#f6e2c4,#fbe0bc calc(var(--ef-darkness,0)*100%))}\n#ef-window-mirror-c stop:nth-child(3){stop-color:color-mix(in srgb,#f6e2c4,#fbe0bc calc(var(--ef-darkness,0)*100%))}\n#ef-window-floor-pool stop:nth-child(1){stop-color:color-mix(in srgb,#f3e2c4,#fbddb0 calc(var(--ef-darkness,0)*100%))}\n#ef-window-floor-pool stop:nth-child(2){stop-color:color-mix(in srgb,#ecdcc2,#efc9a0 calc(var(--ef-darkness,0)*100%))}\n#ef-window-floor-pool stop:nth-child(3){stop-color:color-mix(in srgb,#dce1ec,#c4bccc calc(var(--ef-darkness,0)*100%))}\n#ef-floor-light-fade stop:nth-child(1){stop-color:color-mix(in srgb,#fbe7c6,#fff0d6 calc(var(--ef-darkness,0)*100%))}\n#ef-floor-light-fade stop:nth-child(2){stop-color:color-mix(in srgb,#fdebcd,#fff2da calc(var(--ef-darkness,0)*100%))}\n#ef-floor-light-fade stop:nth-child(3){stop-color:color-mix(in srgb,#fdebcd,#fff2da calc(var(--ef-darkness,0)*100%))}\n#ef-floor-light-fade stop:nth-child(4){stop-color:color-mix(in srgb,#f6e0bd,#f6dcb8 calc(var(--ef-darkness,0)*100%))}\n#ef-floor-light-fade stop:nth-child(5){stop-color:color-mix(in srgb,#f0dcbc,#f0d2b0 calc(var(--ef-darkness,0)*100%))}\n#ef-floor-light-fade stop:nth-child(6){stop-color:color-mix(in srgb,#e1cbb6,#e4bda2 calc(var(--ef-darkness,0)*100%))}\n#ef-floor-light-fade stop:nth-child(7){stop-color:color-mix(in srgb,#dce1ec,#d0c0d4 calc(var(--ef-darkness,0)*100%))}\n#ef-window-core-fade stop:nth-child(1){stop-color:color-mix(in srgb,#fdeccf,#ffebd0 calc(var(--ef-darkness,0)*100%))}\n#ef-window-core-fade stop:nth-child(2){stop-color:color-mix(in srgb,#fce6c4,#ffe6c6 calc(var(--ef-darkness,0)*100%))}\n#ef-window-core-fade stop:nth-child(3){stop-color:color-mix(in srgb,#fce6c4,#ffe6c6 calc(var(--ef-darkness,0)*100%))}\n#ef-window-core-fade stop:nth-child(4){stop-color:color-mix(in srgb,#eed6ba,#fbd0a2 calc(var(--ef-darkness,0)*100%))}\n#ef-window-core-fade stop:nth-child(5){stop-color:color-mix(in srgb,#e8d0b8,#f2c8a2 calc(var(--ef-darkness,0)*100%))}\n#ef-window-core-fade stop:nth-child(6){stop-color:color-mix(in srgb,#dce1ec,#d8c4d0 calc(var(--ef-darkness,0)*100%))}\n#ef-reflected-light stop:nth-child(1){stop-color:color-mix(in srgb,#fcf7f0,#fff4dc calc(var(--ef-darkness,0)*100%))}\n#ef-reflected-light stop:nth-child(2){stop-color:color-mix(in srgb,#f2eae0,#f8dcba calc(var(--ef-darkness,0)*100%))}\n#ef-reflected-light stop:nth-child(3){stop-color:color-mix(in srgb,#e6e0da,#e9c6a4 calc(var(--ef-darkness,0)*100%))}\n#ef-reflected-light stop:nth-child(4){stop-color:color-mix(in srgb,#dfe2ec,#dfb998 calc(var(--ef-darkness,0)*100%))}\n#ef-bumper-left stop:nth-child(1){stop-color:color-mix(in srgb,#646770,#786a5f var(--ef-cabin-tint,0%))}\n#ef-bumper-left stop:nth-child(2){stop-color:color-mix(in srgb,#8b8f99,#a89688 var(--ef-cabin-tint,0%))}\n#ef-bumper-left stop:nth-child(3){stop-color:color-mix(in srgb,#b8bcc8,#dfcbb7 var(--ef-cabin-tint,0%))}\n#ef-bumper-left stop:nth-child(4){stop-color:color-mix(in srgb,#eaedf5,#fff4e2 var(--ef-cabin-tint,0%))}\n#ef-bumper-left stop:nth-child(5){stop-color:color-mix(in srgb,#9ca0ac,#cfb9a6 var(--ef-cabin-tint,0%))}\n#ef-bumper-left stop:nth-child(6){stop-color:color-mix(in srgb,#b8bcc8,#edd8c4 var(--ef-cabin-tint,0%))}\n#ef-bumper-left stop:nth-child(7){stop-color:color-mix(in srgb,#a2a6b2,#d8b89e var(--ef-cabin-tint,0%))}\n#ef-bumper-right stop:nth-child(1){stop-color:color-mix(in srgb,#52545b,#4f4b4e var(--ef-cabin-tint,0%))}\n#ef-bumper-right stop:nth-child(2){stop-color:color-mix(in srgb,#4b4d54,#474447 var(--ef-cabin-tint,0%))}\n#ef-bumper-right stop:nth-child(3){stop-color:color-mix(in srgb,#54565e,#4d4a4e var(--ef-cabin-tint,0%))}\n#ef-bumper-right stop:nth-child(4){stop-color:color-mix(in srgb,#4b4d54,#434146 var(--ef-cabin-tint,0%))}\n#ef-bumper-right stop:nth-child(5){stop-color:color-mix(in srgb,#52545c,#47464b var(--ef-cabin-tint,0%))}\n#ef-bumper-right stop:nth-child(6){stop-color:color-mix(in srgb,#494b52,#403f44 var(--ef-cabin-tint,0%))}\n#ef-bumper-right stop:nth-child(7){stop-color:color-mix(in srgb,#42444a,#3a393e var(--ef-cabin-tint,0%))}\n#ef-hatch-left stop:nth-child(1){stop-color:color-mix(in srgb,#6b6d75,#846954 var(--ef-cabin-tint,0%))}\n#ef-hatch-left stop:nth-child(2){stop-color:color-mix(in srgb,#c6cad6,#f5d8b8 var(--ef-cabin-tint,0%))}\n#ef-hatch-left stop:nth-child(3){stop-color:color-mix(in srgb,#ffffff,#fffbef var(--ef-cabin-tint,0%))}\n#ef-hatch-left stop:nth-child(4){stop-color:color-mix(in srgb,#848894,#c4ad98 var(--ef-cabin-tint,0%))}\n#ef-hatch-left stop:nth-child(5){stop-color:color-mix(in srgb,#747884,#b09884 var(--ef-cabin-tint,0%))}\n#ef-hatch-left stop:nth-child(6){stop-color:color-mix(in srgb,#7c808c,#b69f8c var(--ef-cabin-tint,0%))}\n#ef-hatch-right stop:nth-child(1){stop-color:color-mix(in srgb,#8b8e98,#a88e7a var(--ef-cabin-tint,0%))}\n#ef-hatch-right stop:nth-child(2){stop-color:color-mix(in srgb,#969cad,#92868c var(--ef-cabin-tint,0%))}\n#ef-hatch-right stop:nth-child(3){stop-color:color-mix(in srgb,#c2cbde,#b8b6c8 var(--ef-cabin-tint,0%))}\n#ef-hatch-right stop:nth-child(4){stop-color:color-mix(in srgb,#949eb0,#7c8aa8 var(--ef-cabin-tint,0%))}\n#ef-hatch-right stop:nth-child(5){stop-color:color-mix(in srgb,#757c8d,#5e6c88 var(--ef-cabin-tint,0%))}\n#ef-hatch-right stop:nth-child(6){stop-color:color-mix(in srgb,#787f8f,#66738c var(--ef-cabin-tint,0%))}\n#ef-deck-left stop:nth-child(1){stop-color:color-mix(in srgb,#42444a,#786250 var(--ef-cabin-tint,0%))}\n#ef-deck-left stop:nth-child(2){stop-color:color-mix(in srgb,#abaab0,#eccfb0 var(--ef-cabin-tint,0%))}\n#ef-deck-left stop:nth-child(3){stop-color:color-mix(in srgb,#b8b7bc,#f2d4b2 var(--ef-cabin-tint,0%))}\n#ef-deck-left stop:nth-child(4){stop-color:color-mix(in srgb,#c6c5cb,#f6d9b6 var(--ef-cabin-tint,0%))}\n#ef-deck-left stop:nth-child(5){stop-color:color-mix(in srgb,#d5d5dc,#fce2c2 var(--ef-cabin-tint,0%))}\n#ef-deck-left stop:nth-child(6){stop-color:color-mix(in srgb,#dce0e8,#ffe8c8 var(--ef-cabin-tint,0%))}\n#ef-deck-left stop:nth-child(7){stop-color:color-mix(in srgb,#e1e4ee,#ffefd0 var(--ef-cabin-tint,0%))}\n#ef-deck-left stop:nth-child(8){stop-color:color-mix(in srgb,#e8ecf5,#fff4d8 var(--ef-cabin-tint,0%))}\n#ef-deck-left stop:nth-child(9){stop-color:color-mix(in srgb,#f0f3fa,#fff8e0 var(--ef-cabin-tint,0%))}\n#ef-deck-right stop:nth-child(1){stop-color:color-mix(in srgb,#333338,#685442 var(--ef-cabin-tint,0%))}\n#ef-deck-right stop:nth-child(2){stop-color:color-mix(in srgb,#a2a1a6,#edcca6 var(--ef-cabin-tint,0%))}\n#ef-deck-right stop:nth-child(3){stop-color:color-mix(in srgb,#aeafb6,#f3d3ad var(--ef-cabin-tint,0%))}\n#ef-deck-right stop:nth-child(4){stop-color:color-mix(in srgb,#b8bcc7,#e8ccb0 var(--ef-cabin-tint,0%))}\n#ef-deck-right stop:nth-child(5){stop-color:color-mix(in srgb,#c6d0e2,#cebfb5 var(--ef-cabin-tint,0%))}\n#ef-deck-right stop:nth-child(6){stop-color:color-mix(in srgb,#b0bdd4,#9d9eaf var(--ef-cabin-tint,0%))}\n#ef-deck-right stop:nth-child(7){stop-color:color-mix(in srgb,#8d99b0,#7a849f var(--ef-cabin-tint,0%))}\n#ef-deck-right stop:nth-child(8){stop-color:color-mix(in srgb,#79869e,#6d799b var(--ef-cabin-tint,0%))}\n#ef-deck-right stop:nth-child(9){stop-color:color-mix(in srgb,#747e90,#787796 var(--ef-cabin-tint,0%))}\n#ef-glass-left stop:nth-child(1){stop-color:color-mix(in srgb,#3c3d42,#6e5946 var(--ef-cabin-tint,0%))}\n#ef-glass-left stop:nth-child(2){stop-color:color-mix(in srgb,#25272c,#46392f var(--ef-cabin-tint,0%))}\n#ef-glass-left stop:nth-child(3){stop-color:color-mix(in srgb,#14161a,#26201c var(--ef-cabin-tint,0%))}\n#ef-glass-left stop:nth-child(4){stop-color:color-mix(in srgb,#0b0c0f,#15120f var(--ef-cabin-tint,0%))}\n#ef-glass-left stop:nth-child(5){stop-color:color-mix(in srgb,#040507,#0a0807 var(--ef-cabin-tint,0%))}\n#ef-glass-right stop:nth-child(1){stop-color:color-mix(in srgb,#050608,#0f0d0b var(--ef-cabin-tint,0%))}\n#ef-glass-right stop:nth-child(2){stop-color:color-mix(in srgb,#0b0c0f,#161311 var(--ef-cabin-tint,0%))}\n#ef-glass-right stop:nth-child(3){stop-color:color-mix(in srgb,#0e1014,#181513 var(--ef-cabin-tint,0%))}\n#ef-glass-right stop:nth-child(4){stop-color:color-mix(in srgb,#14161b,#201c1a var(--ef-cabin-tint,0%))}\n#ef-glass-right stop:nth-child(5){stop-color:color-mix(in srgb,#22242b,#2c2826 var(--ef-cabin-tint,0%))}\n#ef-quarter-left stop:nth-child(1){stop-color:color-mix(in srgb,#61656f,#656269 var(--ef-cabin-tint,0%))}\n#ef-quarter-left stop:nth-child(2){stop-color:color-mix(in srgb,#787d8a,#7c7a85 var(--ef-cabin-tint,0%))}\n#ef-quarter-left stop:nth-child(3){stop-color:color-mix(in srgb,#939aab,#9b9caa var(--ef-cabin-tint,0%))}\n#ef-quarter-left stop:nth-child(4){stop-color:color-mix(in srgb,#aab3ca,#bfc1d3 var(--ef-cabin-tint,0%))}\n#ef-quarter-left stop:nth-child(5){stop-color:color-mix(in srgb,#b1bdda,#e8dfef var(--ef-cabin-tint,0%))}\n#ef-quarter-right stop:nth-child(1){stop-color:color-mix(in srgb,#4e5057,#5a585d var(--ef-cabin-tint,0%))}\n#ef-quarter-right stop:nth-child(2){stop-color:color-mix(in srgb,#53565c,#565559 var(--ef-cabin-tint,0%))}\n#ef-quarter-right stop:nth-child(3){stop-color:color-mix(in srgb,#696d79,#676771 var(--ef-cabin-tint,0%))}\n#ef-quarter-right stop:nth-child(4){stop-color:color-mix(in srgb,#666b77,#656971 var(--ef-cabin-tint,0%))}\n#ef-quarter-right stop:nth-child(5){stop-color:color-mix(in srgb,#484c53,#675456 var(--ef-cabin-tint,0%))}\n#ef-clearcoat-roll stop:nth-child(1){stop-color:color-mix(in srgb,#f7f9ff,#fff5e0 var(--ef-cabin-tint,0%))}\n#ef-clearcoat-roll stop:nth-child(2){stop-color:color-mix(in srgb,#dce1ee,#f4dfc6 var(--ef-cabin-tint,0%))}\n#ef-clearcoat-roll stop:nth-child(3){stop-color:color-mix(in srgb,#b0b6c4,#cfa888 var(--ef-cabin-tint,0%))}\n.ef-car-hi-a{stroke:color-mix(in srgb,#dce1ec,#ffe8c8 var(--ef-cabin-tint,0%))}\n.ef-car-hi-b{stroke:color-mix(in srgb,#b6bcc8,#e4c4a2 var(--ef-cabin-tint,0%))}\n.ef-sash1{stroke:color-mix(in srgb,#babec6,#ffe3ae calc(var(--ef-darkness,0)*100%))}\n.ef-sash2{stroke:color-mix(in srgb,#cfc8bc,#ffe8b8 calc(var(--ef-darkness,0)*100%))}\n}\n.ef.ef-low :is([fill=\"url(#ef-stucco-relief)\"],[fill=\"url(#ef-render-grain)\"],[fill=\"url(#ef-polished-grain)\"],.ef-frost,.ef-reflection,.ef-garage-spill,.ef-pane-spill){display:none}\n.ef.ef-low :is([filter=\"url(#ef-floor-soft)\"],[filter=\"url(#ef-cast-shadow)\"],[filter=\"url(#ef-eave-penumbra)\"],[filter=\"url(#ef-wall-shadow)\"],[filter=\"url(#ef-ao-blur)\"],[filter=\"url(#ef-rim-shadow)\"],[filter=\"url(#ef-car-fall-blur)\"],[filter=\"url(#ef-car-shade-blur)\"],[filter=\"url(#ef-pane-inner-shade)\"]){display:none}\n.ef.ef-low :is([filter=\"url(#ef-contact-shadow)\"],[filter=\"url(#ef-array-shadow)\"],[filter=\"url(#ef-car-touch)\"],[filter=\"url(#ef-optical-blur)\"],[filter=\"url(#ef-xmas-frost)\"]){filter:none}\n.ef.ef-low :is(#ef-b1-battery,#ef-b2-battery,#ef-ev-charger,#ef-car [stroke=\"#d3262f\"]){filter:none}\n.ef.ef-low #ef-rain .ef-streaks path,.ef.ef-low #ef-snow circle{animation-play-state:paused}\n.ef.ef-low.ef-no-gl .ef-pulse{display:none}\n.ef.ef-low.ef-no-gl :is(.ef-p10,.ef-p25,.ef-p40,.ef-p51){display:inline}\n.ef.ef-low.ef-no-gl .ef-p10{opacity:.15}\n.ef.ef-low.ef-no-gl .ef-p25{opacity:.25}\n.ef.ef-low.ef-no-gl .ef-p40{opacity:.38}\n.ef.ef-low.ef-no-gl .ef-p51{opacity:.75}\n]]></style>\n<linearGradient id=\"ef-sky\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n<stop offset=\"0\" stop-color=\"#5d646c\"/><stop offset=\".107\" stop-color=\"#494e54\"/><stop offset=\".213\" stop-color=\"#393e44\"/>\n<stop offset=\".32\" stop-color=\"#32353a\"/><stop offset=\".46\" stop-color=\"#27282c\"/><stop offset=\".57\" stop-color=\"#151618\"/>\n<stop offset=\".64\" stop-color=\"#101012\"/><stop offset=\".72\" stop-color=\"#17181a\"/><stop offset=\".82\" stop-color=\"#1b1c1e\"/>\n<stop offset=\"1\" stop-color=\"#161719\"/>\n</linearGradient>\n<linearGradient id=\"ef-clear-g\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#6f93bd\" stop-opacity=\".62\"/><stop offset=\".55\" stop-color=\"#5b7594\" stop-opacity=\".22\"/><stop offset=\"1\" stop-color=\"#5b7594\" stop-opacity=\"0\"/></linearGradient>\n<linearGradient id=\"ef-flash-g\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#dbe6ff\"/><stop offset=\".6\" stop-color=\"#dbe6ff\" stop-opacity=\".55\"/><stop offset=\"1\" stop-color=\"#dbe6ff\" stop-opacity=\"0\"/></linearGradient>\n<linearGradient id=\"ef-night-g\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#04060c\" stop-opacity=\".82\"/><stop offset=\".7\" stop-color=\"#04060c\" stop-opacity=\".45\"/><stop offset=\"1\" stop-color=\"#04060c\" stop-opacity=\"0\"/></linearGradient>\n<radialGradient id=\"ef-twilight-g\"><stop offset=\"0\" stop-color=\"#e49968\" stop-opacity=\".43\"/><stop offset=\".38\" stop-color=\"#c47b6b\" stop-opacity=\".26\"/><stop offset=\".72\" stop-color=\"#956780\" stop-opacity=\".12\"/><stop offset=\"1\" stop-color=\"#956780\" stop-opacity=\"0\"/></radialGradient>\n<radialGradient id=\"ef-c1\"><stop offset=\"0\" stop-color=\"#8b929a\" stop-opacity=\"1.00\"/><stop offset=\"0.25\" stop-color=\"#8b929a\" stop-opacity=\"0.75\"/><stop offset=\"0.5\" stop-color=\"#8b929a\" stop-opacity=\"0.50\"/><stop offset=\"0.75\" stop-color=\"#8b929a\" stop-opacity=\"0.17\"/><stop offset=\"0.9\" stop-color=\"#8b929a\" stop-opacity=\"0.04\"/><stop offset=\"1\" stop-color=\"#8b929a\" stop-opacity=\"0.00\"/></radialGradient><radialGradient id=\"ef-c2\"><stop offset=\"0\" stop-color=\"#d6dbdf\" stop-opacity=\"1.00\"/><stop offset=\"0.25\" stop-color=\"#d6dbdf\" stop-opacity=\"0.75\"/><stop offset=\"0.5\" stop-color=\"#d6dbdf\" stop-opacity=\"0.50\"/><stop offset=\"0.75\" stop-color=\"#d6dbdf\" stop-opacity=\"0.17\"/><stop offset=\"0.9\" stop-color=\"#d6dbdf\" stop-opacity=\"0.04\"/><stop offset=\"1\" stop-color=\"#d6dbdf\" stop-opacity=\"0.00\"/></radialGradient><radialGradient id=\"ef-c3\"><stop offset=\"0\" stop-color=\"#80878f\" stop-opacity=\"1.00\"/><stop offset=\"0.25\" stop-color=\"#80878f\" stop-opacity=\"0.72\"/><stop offset=\"0.5\" stop-color=\"#80878f\" stop-opacity=\"0.45\"/><stop offset=\"0.75\" stop-color=\"#80878f\" stop-opacity=\"0.15\"/><stop offset=\"0.9\" stop-color=\"#80878f\" stop-opacity=\"0.04\"/><stop offset=\"1\" stop-color=\"#80878f\" stop-opacity=\"0.00\"/></radialGradient><radialGradient id=\"ef-c4\"><stop offset=\"0\" stop-color=\"#c9cac4\" stop-opacity=\"1.00\"/><stop offset=\"0.25\" stop-color=\"#c9cac4\" stop-opacity=\"0.71\"/><stop offset=\"0.5\" stop-color=\"#c9cac4\" stop-opacity=\"0.42\"/><stop offset=\"0.75\" stop-color=\"#c9cac4\" stop-opacity=\"0.14\"/><stop offset=\"0.9\" stop-color=\"#c9cac4\" stop-opacity=\"0.03\"/><stop offset=\"1\" stop-color=\"#c9cac4\" stop-opacity=\"0.00\"/></radialGradient>\n<radialGradient id=\"ef-c5\"><stop offset=\"0\" stop-color=\"#a2a9b0\" stop-opacity=\"1.00\"/><stop offset=\"0.25\" stop-color=\"#a2a9b0\" stop-opacity=\"0.78\"/><stop offset=\"0.5\" stop-color=\"#a2a9b0\" stop-opacity=\"0.55\"/><stop offset=\"0.75\" stop-color=\"#a2a9b0\" stop-opacity=\"0.18\"/><stop offset=\"0.9\" stop-color=\"#a2a9b0\" stop-opacity=\"0.04\"/><stop offset=\"1\" stop-color=\"#a2a9b0\" stop-opacity=\"0.00\"/></radialGradient><radialGradient id=\"ef-c6\"><stop offset=\"0\" stop-color=\"#ffffff\" stop-opacity=\"1.00\"/><stop offset=\"0.25\" stop-color=\"#ffffff\" stop-opacity=\"0.70\"/><stop offset=\"0.5\" stop-color=\"#ffffff\" stop-opacity=\"0.40\"/><stop offset=\"0.75\" stop-color=\"#ffffff\" stop-opacity=\"0.13\"/><stop offset=\"0.9\" stop-color=\"#ffffff\" stop-opacity=\"0.03\"/><stop offset=\"1\" stop-color=\"#ffffff\" stop-opacity=\"0.00\"/></radialGradient><radialGradient id=\"ef-c7\"><stop offset=\"0\" stop-color=\"#fff1cc\" stop-opacity=\"1.00\"/><stop offset=\"0.25\" stop-color=\"#fff1cc\" stop-opacity=\"0.68\"/><stop offset=\"0.5\" stop-color=\"#fff1cc\" stop-opacity=\"0.35\"/><stop offset=\"0.75\" stop-color=\"#fff1cc\" stop-opacity=\"0.12\"/><stop offset=\"0.9\" stop-color=\"#fff1cc\" stop-opacity=\"0.03\"/><stop offset=\"1\" stop-color=\"#fff1cc\" stop-opacity=\"0.00\"/></radialGradient>\n<linearGradient id=\"ef-sh-g0\" gradientUnits=\"userSpaceOnUse\" x1=\"290\" y1=\"1071\" x2=\"249.2\" y2=\"1185.8\"><stop offset=\"0\" stop-opacity=\".4\"/><stop offset=\".3\" stop-opacity=\".22\"/><stop offset=\".65\" stop-opacity=\".07\"/><stop offset=\"1\" stop-opacity=\"0\"/></linearGradient><linearGradient id=\"ef-sh-f0\" gradientUnits=\"userSpaceOnUse\" x1=\"290\" y1=\"1071\" x2=\"323\" y2=\"1201.7\"><stop offset=\"0\" stop-opacity=\".4\"/><stop offset=\".3\" stop-opacity=\".22\"/><stop offset=\".65\" stop-opacity=\".07\"/><stop offset=\"1\" stop-opacity=\"0\"/></linearGradient><linearGradient id=\"ef-sh-g1\" gradientUnits=\"userSpaceOnUse\" x1=\"290\" y1=\"1071\" x2=\"252.4\" y2=\"1177\"><stop offset=\"0\" stop-opacity=\".4\"/><stop offset=\".3\" stop-opacity=\".22\"/><stop offset=\".65\" stop-opacity=\".07\"/><stop offset=\"1\" stop-opacity=\"0\"/></linearGradient><linearGradient id=\"ef-sh-f1\" gradientUnits=\"userSpaceOnUse\" x1=\"290\" y1=\"1071\" x2=\"324.7\" y2=\"1208.4\"><stop offset=\"0\" stop-opacity=\".4\"/><stop offset=\".3\" stop-opacity=\".22\"/><stop offset=\".65\" stop-opacity=\".07\"/><stop offset=\"1\" stop-opacity=\"0\"/></linearGradient><linearGradient id=\"ef-sh-g2\" gradientUnits=\"userSpaceOnUse\" x1=\"290\" y1=\"1071\" x2=\"255.7\" y2=\"1167.5\"><stop offset=\"0\" stop-opacity=\".4\"/><stop offset=\".3\" stop-opacity=\".22\"/><stop offset=\".65\" stop-opacity=\".07\"/><stop offset=\"1\" stop-opacity=\"0\"/></linearGradient><linearGradient id=\"ef-sh-f2\" gradientUnits=\"userSpaceOnUse\" x1=\"290\" y1=\"1071\" x2=\"326.5\" y2=\"1215.5\"><stop offset=\"0\" stop-opacity=\".4\"/><stop offset=\".3\" stop-opacity=\".22\"/><stop offset=\".65\" stop-opacity=\".07\"/><stop offset=\"1\" stop-opacity=\"0\"/></linearGradient>\n<radialGradient id=\"ef-sun-disc\"><stop offset=\".55\" stop-color=\"#fffae6\"/><stop offset=\".9\" stop-color=\"#fff0c4\"/><stop offset=\"1\" stop-color=\"#ffe3a4\"/></radialGradient>\n<radialGradient id=\"ef-moon-disc\" cx=\".36\" cy=\".3\" r=\".71\"><stop offset=\"0\" stop-color=\"#f2f3eb\"/><stop offset=\".74\" stop-color=\"#d4d9dc\"/><stop offset=\"1\" stop-color=\"#a7b3c2\"/></radialGradient>\n<clipPath id=\"ef-moon-lit\"><path id=\"ef-moon-phase\"/></clipPath>\n<radialGradient id=\"ef-xmas-warm\"><stop offset=\"0\" stop-color=\"#ffd58a\" stop-opacity=\".9\"/><stop offset=\".3\" stop-color=\"#ffc061\" stop-opacity=\".32\"/><stop offset=\"1\" stop-color=\"#ffb347\" stop-opacity=\"0\"/></radialGradient>\n<linearGradient id=\"ef-xmas-wash\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"46\"><stop offset=\"0\" stop-color=\"#ffbe62\" stop-opacity=\".55\"/><stop offset=\"1\" stop-color=\"#ffbe62\" stop-opacity=\"0\"/></linearGradient>\n<linearGradient id=\"ef-pv-silicon\" x1=\"0\" y1=\"1\" x2=\".85\" y2=\"0\">\n  <stop style=\"stop-color:var(--ef-glass-3,#090b0e)\"/>\n  <stop offset=\".52\" style=\"stop-color:var(--ef-glass-2,#111419)\"/>\n  <stop offset=\"1\" style=\"stop-color:var(--ef-glass-1,#191e25)\"/>\n</linearGradient>\n<linearGradient id=\"ef-pv-skylight\" x1=\".08\" y1=\".13\" x2=\".92\" y2=\".81\">\n  <stop stop-color=\"#7794b6\" stop-opacity=\".035\"/>\n  <stop offset=\".24\" stop-color=\"#819ab9\" stop-opacity=\".12\"/>\n  <stop offset=\".44\" stop-color=\"#7b98c0\" stop-opacity=\".21\"/>\n  <stop offset=\".61\" stop-color=\"#56739b\" stop-opacity=\".10\"/>\n  <stop offset=\"1\" stop-color=\"#243953\" stop-opacity=\".025\"/>\n</linearGradient>\n<linearGradient id=\"ef-pv-satin\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\".8\">\n  <stop stop-color=\"#202326\"/><stop offset=\".58\" stop-color=\"#191b1e\"/><stop offset=\"1\" stop-color=\"#111315\"/>\n</linearGradient>\n<g id=\"ef-pv-cell-bank\" fill=\"none\">\n  <path d=\"M2.6 .35v72.8 M7.75 .35v72.8 M12.9 .35v72.8 M18.1 .35v72.8 M23.25 .35v72.8 M28.4 .35v72.8\n           M33.6 .35v72.8 M38.75 .35v72.8 M43.9 .35v72.8 M49.1 .35v72.8 M54.25 .35v72.8 M59.4 .35v72.8\n           M64.6 .35v72.8 M69.75 .35v72.8 M74.9 .35v72.8 M80.1 .35v72.8 M85.25 .35v72.8 M90.4 .35v72.8\"\n        stroke=\"#a8b3c5\" stroke-width=\".44\" stroke-opacity=\".26\" stroke-dasharray=\"11.55 .7\"/>\n  <path d=\"M15.5 0v73.5 M31 0v73.5 M46.5 0v73.5 M62 0v73.5 M77.5 0v73.5\n           M0 12.25h93 M0 24.5h93 M0 36.75h93 M0 49h93 M0 61.25h93\"\n        stroke=\"#020305\" stroke-width=\".64\" stroke-opacity=\".60\"/>\n</g>\n<g id=\"ef-pv-module\">\n  <g class=\"ef-pv-cell-detail\">\n    <use href=\"#ef-pv-cell-bank\" x=\"3.5\" y=\"3.7\"/>\n    <use href=\"#ef-pv-cell-bank\" x=\"3.5\" y=\"78.8\"/>\n  </g>\n  <path d=\"M3.5 78h93\" stroke=\"#090b10\" stroke-width=\".9\"/>\n  <path d=\"M0 0h100v156H0Z M2.35 2.6h95.3v150.8H2.35Z\"\n        fill=\"url(#ef-pv-satin)\" fill-rule=\"evenodd\"/>\n  <path d=\"M.6 155.25h98.7V.7\" fill=\"none\" stroke=\"#050608\" stroke-width=\"1.35\"/>\n  <path d=\"M2.35 153.4V2.6h95.3\" fill=\"none\" stroke=\"#030405\" stroke-opacity=\".85\" stroke-width=\".72\"/>\n</g>\n<g id=\"ef-pv-row\">\n  <use href=\"#ef-pv-module\"/><use href=\"#ef-pv-module\" x=\"100\"/><use href=\"#ef-pv-module\" x=\"200\"/>\n  <use href=\"#ef-pv-module\" x=\"300\"/><use href=\"#ef-pv-module\" x=\"400\"/><use href=\"#ef-pv-module\" x=\"500\"/>\n</g>\n<g id=\"ef-pv-field\">\n  <rect width=\"600\" height=\"624\" fill=\"url(#ef-pv-silicon)\"/>\n  <rect class=\"ef-pv-skylight\" width=\"600\" height=\"624\" fill=\"url(#ef-pv-skylight)\"/>\n  <use href=\"#ef-pv-row\"/><use href=\"#ef-pv-row\" y=\"156\"/><use href=\"#ef-pv-row\" y=\"312\"/><use href=\"#ef-pv-row\" y=\"468\"/>\n</g>\n<radialGradient id=\"ef-slab\" cx=\".47\" cy=\".13\" r=\".94\">\n  <stop stop-color=\"var(--ef-slab-near,#b8b8bd)\"/><stop offset=\".56\" stop-color=\"var(--ef-slab-mid,#d3d5df)\"/>\n  <stop offset=\"1\" stop-color=\"var(--ef-slab-far,#e2e7f2)\"/>\n</radialGradient>\n<linearGradient id=\"ef-slab-right-tint\" x1=\".25\" y1=\".2\" x2=\"1\" y2=\".85\">\n  <stop offset=\"0\" stop-color=\"#89a2de\" stop-opacity=\"0\"/>\n  <stop offset=\".55\" stop-color=\"#d2dff6\" style=\"stop-opacity:calc(.08 + .18 * var(--ef-darkness,0))\"/>\n  <stop offset=\"1\" stop-color=\"#d8e4f8\" style=\"stop-opacity:calc(.10 + .26 * var(--ef-darkness,0))\"/>\n</linearGradient>\n<radialGradient id=\"ef-ground-sheen-r\" cx=\".5\" cy=\".5\" r=\".5\">\n  <stop offset=\"0\" stop-color=\"#f4f7ff\" style=\"stop-opacity:calc(.14 + .16 * var(--ef-darkness,0))\"/>\n  <stop offset=\".55\" stop-color=\"#eef2fc\" style=\"stop-opacity:calc(.06 + .07 * var(--ef-darkness,0))\"/>\n  <stop offset=\"1\" stop-color=\"#d6e3ff\" stop-opacity=\"0\"/>\n</radialGradient>\n<radialGradient id=\"ef-corner-shadow-tail\" cx=\".38\" cy=\".5\" r=\".62\">\n  <stop offset=\"0\" stop-color=\"#2c3552\" stop-opacity=\".26\"/>\n  <stop offset=\".52\" stop-color=\"#353f5e\" stop-opacity=\".13\"/>\n  <stop offset=\"1\" stop-color=\"#404b6a\" stop-opacity=\"0\"/>\n</radialGradient>\n<radialGradient id=\"ef-slab-shade\">\n  <stop stop-color=\"#2c3348\" stop-opacity=\".22\"/><stop offset=\".55\" stop-color=\"#353d54\" stop-opacity=\".13\"/>\n  <stop offset=\"1\" stop-color=\"#404860\" stop-opacity=\"0\"/>\n</radialGradient>\n<filter id=\"ef-floor-soft\" filterUnits=\"userSpaceOnUse\" x=\"-60\" y=\"866\" width=\"1100\" height=\"350\"><feGaussianBlur stdDeviation=\"19\"/></filter>\n<filter id=\"ef-polished-reflection\" filterUnits=\"userSpaceOnUse\" x=\"-90\" y=\"859\" width=\"1140\" height=\"400\" color-interpolation-filters=\"sRGB\">\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\".028 .33\" numOctaves=\"2\" seed=\"8\" result=\"grain\"/>\n  <feColorMatrix in=\"grain\" type=\"matrix\" values=\"0 0 0 0 1   0 0 0 0 1   0 0 0 0 1   .08 .16 .08 0 .82\" result=\"roughness\"/>\n  <feComposite in=\"SourceGraphic\" in2=\"roughness\" operator=\"in\"/>\n</filter>\n<linearGradient id=\"ef-window-mirror-a\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"1230\" x2=\"0\" y2=\"1362\" gradientTransform=\"matrix(1 -.2173 0 1 0 0)\"><stop offset=\"0\" stop-color=\"#f6e2c4\" stop-opacity=\".5\"/><stop offset=\".35\" stop-color=\"#f6e2c4\" stop-opacity=\".2\"/><stop offset=\".65\" stop-color=\"#f6e2c4\" stop-opacity=\"0\"/><stop offset=\"1\" stop-color=\"#f6e2c4\" stop-opacity=\"0\"/></linearGradient>\n<linearGradient id=\"ef-window-mirror-b\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"1230\" x2=\"0\" y2=\"1362\" gradientTransform=\"matrix(1 -.2173 0 1 0 0)\"><stop offset=\"0\" stop-color=\"#f6e2c4\" stop-opacity=\".26\"/><stop offset=\".4\" stop-color=\"#f6e2c4\" stop-opacity=\".17\"/><stop offset=\".8\" stop-color=\"#f6e2c4\" stop-opacity=\".04\"/><stop offset=\"1\" stop-color=\"#f6e2c4\" stop-opacity=\"0\"/></linearGradient>\n<linearGradient id=\"ef-window-mirror-c\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"1230\" x2=\"0\" y2=\"1362\" gradientTransform=\"matrix(1 -.2173 0 1 0 0)\"><stop offset=\"0\" stop-color=\"#f6e2c4\" stop-opacity=\".16\"/><stop offset=\".5\" stop-color=\"#f6e2c4\" stop-opacity=\".1\"/><stop offset=\"1\" stop-color=\"#f6e2c4\" stop-opacity=\"0\"/></linearGradient>\n<filter id=\"ef-pane-mirror-a\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"6 9\"/></filter>\n<filter id=\"ef-pane-mirror-b\" x=\"-40%\" y=\"-40%\" width=\"180%\" height=\"180%\"><feGaussianBlur stdDeviation=\"12 18\"/></filter>\n<filter id=\"ef-pane-mirror-c\" x=\"-50%\" y=\"-50%\" width=\"200%\" height=\"200%\"><feGaussianBlur stdDeviation=\"22 34\"/></filter>\n<filter id=\"ef-spill-blur-a\" x=\"-50%\" y=\"-50%\" width=\"200%\" height=\"200%\"><feGaussianBlur stdDeviation=\"5 6\"/></filter>\n<filter id=\"ef-spill-blur-b\" x=\"-50%\" y=\"-50%\" width=\"200%\" height=\"200%\"><feGaussianBlur stdDeviation=\"11 13\"/></filter>\n<filter id=\"ef-spill-blur-c\" x=\"-50%\" y=\"-50%\" width=\"200%\" height=\"200%\"><feGaussianBlur stdDeviation=\"20 24\"/></filter>\n<linearGradient id=\"ef-window-dark-a\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"1230\" x2=\"0\" y2=\"1362\" gradientTransform=\"matrix(1 -.2173 0 1 0 0)\"><stop offset=\"0\" style=\"stop-color:var(--ef-window-mirror,#cfccc3)\" stop-opacity=\".9\"/><stop offset=\".35\" style=\"stop-color:var(--ef-window-mirror,#cfccc3)\" stop-opacity=\".36\"/><stop offset=\".65\" style=\"stop-color:var(--ef-window-mirror,#cfccc3)\" stop-opacity=\"0\"/><stop offset=\"1\" style=\"stop-color:var(--ef-window-mirror,#cfccc3)\" stop-opacity=\"0\"/></linearGradient>\n<linearGradient id=\"ef-window-dark-b\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"1230\" x2=\"0\" y2=\"1362\" gradientTransform=\"matrix(1 -.2173 0 1 0 0)\"><stop offset=\"0\" style=\"stop-color:var(--ef-window-mirror,#cfccc3)\" stop-opacity=\".5\"/><stop offset=\".4\" style=\"stop-color:var(--ef-window-mirror,#cfccc3)\" stop-opacity=\".34\"/><stop offset=\".8\" style=\"stop-color:var(--ef-window-mirror,#cfccc3)\" stop-opacity=\".07\"/><stop offset=\"1\" style=\"stop-color:var(--ef-window-mirror,#cfccc3)\" stop-opacity=\"0\"/></linearGradient>\n<linearGradient id=\"ef-window-dark-c\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"1230\" x2=\"0\" y2=\"1362\" gradientTransform=\"matrix(1 -.2173 0 1 0 0)\"><stop offset=\"0\" style=\"stop-color:var(--ef-window-mirror,#cfccc3)\" stop-opacity=\".3\"/><stop offset=\".5\" style=\"stop-color:var(--ef-window-mirror,#cfccc3)\" stop-opacity=\".2\"/><stop offset=\"1\" style=\"stop-color:var(--ef-window-mirror,#cfccc3)\" stop-opacity=\"0\"/></linearGradient>\n<filter id=\"ef-pane-floor-blur\" x=\"-50%\" y=\"-30%\" width=\"200%\" height=\"165%\"><feGaussianBlur stdDeviation=\"12 14\"/></filter>\n<filter id=\"ef-pane-floor-core-blur\" x=\"-50%\" y=\"-30%\" width=\"200%\" height=\"165%\"><feGaussianBlur stdDeviation=\"11 10\"/></filter>\n<filter id=\"ef-pane-inner-shade\" x=\"-30%\" y=\"-30%\" width=\"160%\" height=\"160%\"><feGaussianBlur stdDeviation=\"2.6\"/></filter>\n<radialGradient id=\"ef-window-floor-pool\" cx=\".5\" cy=\".5\" r=\".5\">\n  <stop offset=\"0\" stop-color=\"#f3e2c4\" stop-opacity=\".70\"/>\n  <stop offset=\".50\" stop-color=\"#ecdcc2\" stop-opacity=\".36\"/>\n  <stop offset=\"1\" stop-color=\"#dce1ec\" stop-opacity=\"0\"/>\n</radialGradient>\n<linearGradient id=\"ef-floor-light-fade\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"1130\" x2=\"0\" y2=\"1370\" gradientTransform=\"matrix(1 -.2173 0 1 0 0)\">\n  <stop offset=\"0\" stop-color=\"#fbe7c6\" stop-opacity=\"0\"/>\n  <stop offset=\".02\" stop-color=\"#fdebcd\" stop-opacity=\".3\"/>\n  <stop offset=\".12\" stop-color=\"#fdebcd\" stop-opacity=\"1\"/>\n  <stop offset=\".42\" stop-color=\"#f6e0bd\" stop-opacity=\".78\"/>\n  <stop offset=\".64\" stop-color=\"#f0dcbc\" stop-opacity=\".68\"/>\n  <stop offset=\".84\" stop-color=\"#e1cbb6\" stop-opacity=\".30\"/>\n  <stop offset=\"1\" stop-color=\"#dce1ec\" stop-opacity=\"0\"/>\n</linearGradient>\n<linearGradient id=\"ef-window-core-fade\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"1130\" x2=\"0\" y2=\"1348\" gradientTransform=\"matrix(1 -.2173 0 1 0 0)\">\n  <stop offset=\"0\" stop-color=\"#fdeccf\" stop-opacity=\"0\"/>\n  <stop offset=\".05\" stop-color=\"#fce6c4\" stop-opacity=\".12\"/>\n  <stop offset=\".16\" stop-color=\"#fce6c4\" stop-opacity=\"1\"/>\n  <stop offset=\".46\" stop-color=\"#eed6ba\" stop-opacity=\".64\"/>\n  <stop offset=\".76\" stop-color=\"#e8d0b8\" stop-opacity=\".48\"/>\n  <stop offset=\"1\" stop-color=\"#dce1ec\" stop-opacity=\"0\"/>\n</linearGradient>\n<radialGradient id=\"ef-reflected-light\">\n  <stop stop-color=\"#fcf7f0\" stop-opacity=\".98\"/>\n  <stop offset=\".26\" stop-color=\"#f2eae0\" stop-opacity=\".88\"/>\n  <stop offset=\".60\" stop-color=\"#e6e0da\" stop-opacity=\".46\"/>\n  <stop offset=\"1\" stop-color=\"#dfe2ec\" stop-opacity=\"0\"/>\n</radialGradient>\n<path id=\"ef-pv-apertures\" d=\"M2.35 2.6h95.3v150.8h-95.3Z M102.35 2.6h95.3v150.8h-95.3Z M202.35 2.6h95.3v150.8h-95.3Z M302.35 2.6h95.3v150.8h-95.3Z M402.35 2.6h95.3v150.8h-95.3Z M502.35 2.6h95.3v150.8h-95.3Z\n  M2.35 158.6h95.3v150.8h-95.3Z M102.35 158.6h95.3v150.8h-95.3Z M202.35 158.6h95.3v150.8h-95.3Z M302.35 158.6h95.3v150.8h-95.3Z M402.35 158.6h95.3v150.8h-95.3Z M502.35 158.6h95.3v150.8h-95.3Z\n  M2.35 314.6h95.3v150.8h-95.3Z M102.35 314.6h95.3v150.8h-95.3Z M202.35 314.6h95.3v150.8h-95.3Z M302.35 314.6h95.3v150.8h-95.3Z M402.35 314.6h95.3v150.8h-95.3Z M502.35 314.6h95.3v150.8h-95.3Z\n  M2.35 470.6h95.3v150.8h-95.3Z M102.35 470.6h95.3v150.8h-95.3Z M202.35 470.6h95.3v150.8h-95.3Z M302.35 470.6h95.3v150.8h-95.3Z M402.35 470.6h95.3v150.8h-95.3Z M502.35 470.6h95.3v150.8h-95.3Z\"/>\n<clipPath id=\"ef-pv-glass\"><use href=\"#ef-pv-apertures\" transform=\"matrix(1 -.215 1 1.33 147 522) scale(0.995 0.2675)\"/></clipPath>\n<g id=\"ef-pv-snow\">\n  <path d=\"M0 624v-3q23-13 53-9t58 1q31-11 63-6t71 0q34-10 64-5t62 2q22-7 48-4t58 1q25-8 52-4t71-3v30Z\"/>\n  <path d=\"M0 0h600v3q-36 5-75 2t-82 2q-55-3-105 0t-89 0q-43 4-85 1t-80 1Q42 4 0 9Z\"/>\n</g>\n<path id=\"ef-pv-cast-shadow\" d=\"M145.2 529.5 742.2 401.145 909.12 623.1486 312.12 751.5036Z\" fill=\"#08090b\" opacity=\".52\" filter=\"url(#ef-array-shadow)\"/>\n<g id=\"ef-pv-array\">\n  <path d=\"M147 522 313.92 744.0036 910.92 615.6486 910.92 620.2486 313.92 748.6036 147 526.6Z\" fill=\"#111315\"/>\n  <path d=\"M147 522 313.92 744.0036 313.92 748.6036 147 526.6Z\" fill=\"#191b1c\"/>\n  <use href=\"#ef-pv-field\" transform=\"matrix(1 -.215 1 1.33 147 522) scale(0.995 0.2675)\"/>\n</g>\n<g id=\"ef-pv-weather\">\n  <g class=\"ef-frost\" clip-path=\"url(#ef-pv-glass)\"><path d=\"M147 522 744 393.645 910.92 615.6486 313.92 744.0036Z\" fill=\"url(#ef-frost-sheet)\" filter=\"url(#ef-frost-ice)\"/></g>\n  <g class=\"ef-snowcap\" transform=\"matrix(1 -.215 1 1.33 147 522) scale(0.995 0.2675)\"><use href=\"#ef-pv-snow\"/></g>\n</g>\n<clipPath id=\"ef-solar-exit\"><path d=\"M313.92 748.6036 910.92 620.2486 910.92 1000 313.92 1000Z\"/></clipPath>\n<filter id=\"ef-optical-blur\" x=\"-2%\" y=\"-2%\" width=\"104%\" height=\"104%\"><feGaussianBlur stdDeviation=\".42\"/></filter>\n<radialGradient id=\"ef-sun-coating\">\n  <stop stop-color=\"#fffef9\" stop-opacity=\".94\"/><stop offset=\".24\" stop-color=\"#f2f2f7\" stop-opacity=\".72\"/>\n  <stop offset=\".54\" stop-color=\"#dce2f0\" stop-opacity=\".36\"/><stop offset=\".80\" stop-color=\"#cbd4e6\" stop-opacity=\".12\"/><stop offset=\"1\" stop-color=\"#c8d2e6\" stop-opacity=\"0\"/>\n</radialGradient>\n<radialGradient id=\"ef-moon-coating\">\n  <stop stop-color=\"#f0f5ff\" stop-opacity=\".95\"/><stop offset=\".24\" stop-color=\"#cedeff\" stop-opacity=\".74\"/>\n  <stop offset=\".54\" stop-color=\"#9cb5f2\" stop-opacity=\".38\"/><stop offset=\".80\" stop-color=\"#7c98de\" stop-opacity=\".12\"/><stop offset=\"1\" stop-color=\"#7d97d6\" stop-opacity=\"0\"/>\n</radialGradient>\n<g id=\"ef-sun-coating-glint\" opacity=\"0\" fill=\"url(#ef-sun-coating)\">\n  <circle r=\"1\" transform=\"matrix(275 -58 100 195 -12 12)\" opacity=\".74\"/>\n</g>\n<g id=\"ef-sun-fold-glint\" opacity=\"0\"><circle r=\"1\" transform=\"matrix(165 -34 0 48 0 0)\" fill=\"url(#ef-sun-coating)\"/></g>\n<g id=\"ef-moon-coating-glint\" opacity=\"0\" fill=\"url(#ef-moon-coating)\">\n  <circle r=\"1\" transform=\"matrix(275 -58 100 195 -12 12)\" opacity=\".78\"/>\n</g>\n<g id=\"ef-moon-fold-glint\" opacity=\"0\"><circle r=\"1\" transform=\"matrix(165 -34 0 48 0 0)\" fill=\"url(#ef-moon-coating)\"/></g>\n<clipPath id=\"ef-front-roof-plane\"><path d=\"M68 511 763 361.575 981 651.515 286 800.94Z\"/></clipPath>\n<clipPath id=\"ef-back-roof-plane\"><path d=\"M0 268.605 505 160.03 672 382.14 75 510.495 63.5 512.5 0 553.5Z\"/></clipPath>\n<radialGradient id=\"ef-sun-reflection\" gradientUnits=\"userSpaceOnUse\" cx=\"0\" cy=\"0\" r=\"180\">\n  <stop offset=\"0\" stop-color=\"#fff8ed\" stop-opacity=\".29\"/><stop offset=\".09\" stop-color=\"#fff6e7\" stop-opacity=\".22\"/>\n  <stop offset=\".20\" stop-color=\"#fff3dd\" stop-opacity=\".13\"/><stop offset=\".40\" stop-color=\"#ffeed0\" stop-opacity=\".05\"/>\n  <stop offset=\".75\" stop-color=\"#ffeccd\" stop-opacity=\".012\"/><stop offset=\"1\" stop-color=\"#ffeccd\" stop-opacity=\"0\"/>\n</radialGradient>\n<radialGradient id=\"ef-sun-sheen\" gradientUnits=\"userSpaceOnUse\" cx=\"0\" cy=\"0\" r=\"250\">\n  <stop offset=\"0\" stop-color=\"#fff2d7\" stop-opacity=\".085\"/><stop offset=\".48\" stop-color=\"#fff2d7\" stop-opacity=\".038\"/><stop offset=\"1\" stop-color=\"#fff2d7\" stop-opacity=\"0\"/>\n</radialGradient>\n<radialGradient id=\"ef-moon-reflection\" gradientUnits=\"userSpaceOnUse\" cx=\"0\" cy=\"0\" r=\"320\">\n  <stop offset=\"0\" stop-color=\"#e1eeff\" stop-opacity=\".48\"/><stop offset=\".21\" stop-color=\"#bad6fa\" stop-opacity=\".31\"/><stop offset=\".59\" stop-color=\"#9fbbe7\" stop-opacity=\".12\"/><stop offset=\"1\" stop-color=\"#9fbbe7\" stop-opacity=\"0\"/>\n</radialGradient>\n<g id=\"ef-sun-shine\" opacity=\"0\">\n  <rect width=\"1170\" height=\"900\" fill=\"url(#ef-sun-sheen)\"/>\n  <rect width=\"1170\" height=\"900\" fill=\"url(#ef-sun-reflection)\"/>\n</g>\n<rect id=\"ef-moon-shine\" width=\"1170\" height=\"900\" fill=\"url(#ef-moon-reflection)\" opacity=\"0\"/>\n<linearGradient id=\"ef-roof-enamel\" href=\"#ef-roof\" gradientUnits=\"userSpaceOnUse\" x1=\"103\" y1=\"522\" x2=\"875\" y2=\"385\"/>\n<linearGradient id=\"ef-roof\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" style=\"stop-color:var(--ef-roof-1,#333333)\"/><stop offset=\".55\" style=\"stop-color:var(--ef-roof-2,#2c2c2c)\"/><stop offset=\"1\" style=\"stop-color:var(--ef-roof-3,#292929)\"/></linearGradient>\n<linearGradient id=\"ef-roof-back\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"0\"><stop offset=\"0\" style=\"stop-color:var(--ef-roof-back-1,#363636)\"/><stop offset=\"1\" style=\"stop-color:var(--ef-roof-back-2,#303032)\"/></linearGradient>\n<linearGradient id=\"ef-gable-shade\" gradientUnits=\"userSpaceOnUse\" x1=\"20\" y1=\"552.4\" x2=\"48.2\" y2=\"588.7\"><stop offset=\"0\" stop-opacity=\"1\"/><stop offset=\".25\" stop-opacity=\".8\"/><stop offset=\".5\" stop-opacity=\".5\"/><stop offset=\".75\" stop-opacity=\".2\"/><stop offset=\"1\" stop-opacity=\"0\"/></linearGradient>\n<linearGradient id=\"ef-gable\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" style=\"stop-color:var(--ef-gable-1,#272727)\"/><stop offset=\"1\" style=\"stop-color:var(--ef-gable-2,#1c1c1c)\"/></linearGradient>\n<linearGradient id=\"ef-wall\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" style=\"stop-color:var(--ef-wall-1,#0a0a0a)\"/><stop offset=\"1\" style=\"stop-color:var(--ef-wall-2,#0f0f0f)\"/></linearGradient>\n<linearGradient id=\"ef-pane\" x1=\"0\" y1=\"0\" x2=\".35\" y2=\"1\"><stop offset=\"0\" style=\"stop-color:var(--ef-window-1,#d6d3ca)\"/><stop offset=\"1\" style=\"stop-color:var(--ef-window-2,#aeaba3)\"/></linearGradient>\n<linearGradient id=\"ef-b1-body\" gradientUnits=\"userSpaceOnUse\" x1=\"343.5\" y1=\"896.2\" x2=\"342.2\" y2=\"901.0\"><stop offset=\"0\" style=\"stop-color:var(--ef-b1-body-top)\"/><stop offset=\".4\" style=\"stop-color:var(--ef-b1-body-rim)\"/><stop offset=\"1\" style=\"stop-color:var(--ef-b1-body-side)\"/></linearGradient>\n<linearGradient id=\"ef-b2-body\" gradientUnits=\"userSpaceOnUse\" x1=\"454.0\" y1=\"890.1\" x2=\"452.5\" y2=\"894.9\"><stop offset=\"0\" style=\"stop-color:var(--ef-b2-body-top)\"/><stop offset=\".4\" style=\"stop-color:var(--ef-b2-body-rim)\"/><stop offset=\"1\" style=\"stop-color:var(--ef-b2-body-side)\"/></linearGradient>\n<linearGradient id=\"ef-b1-face\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" style=\"stop-color:var(--ef-b1-face-1,#eeeeee)\"/><stop offset=\"1\" style=\"stop-color:var(--ef-b1-face-2,#cdcdcd)\"/></linearGradient>\n<linearGradient id=\"ef-b1-strip\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" style=\"stop-color:var(--ef-b1-strip-1,#8ac7a7)\"/><stop offset=\"1\" style=\"stop-color:var(--ef-b1-strip-2,#76b698)\"/></linearGradient>\n<linearGradient id=\"ef-b2-face\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" style=\"stop-color:var(--ef-b2-face-1,#4b4e54)\"/><stop offset=\"1\" style=\"stop-color:var(--ef-b2-face-2,#2e3034)\"/></linearGradient>\n<linearGradient id=\"ef-b2-strip\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" style=\"stop-color:var(--ef-b2-strip-1,#84c1f6)\"/><stop offset=\"1\" style=\"stop-color:var(--ef-b2-strip-2,#5aa6e6)\"/></linearGradient>\n<linearGradient id=\"ef-meter-face\" x1=\"0\" y1=\"0\" x2=\".35\" y2=\"1\"><stop offset=\"0\" stop-color=\"#666668\"/><stop offset=\".55\" stop-color=\"#555557\"/><stop offset=\"1\" stop-color=\"#454547\"/></linearGradient>\n<linearGradient id=\"ef-meter-side\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#3c3c3e\"/><stop offset=\"1\" stop-color=\"#2a2a2c\"/></linearGradient>\n<linearGradient id=\"ef-meter-bezel\" x1=\"0\" y1=\"0\" x2=\".6\" y2=\"1\"><stop offset=\"0\" stop-color=\"#c9c9cb\"/><stop offset=\"1\" stop-color=\"#6b6b6d\"/></linearGradient>\n<radialGradient id=\"ef-meter-glass\" cx=\".4\" cy=\".35\" r=\".7\"><stop offset=\"0\" stop-color=\"#e4e4e6\"/><stop offset=\".7\" stop-color=\"#a6a6a8\"/><stop offset=\"1\" stop-color=\"#7c7c7e\"/></radialGradient>\n<linearGradient id=\"ef-grid-fade\" gradientUnits=\"userSpaceOnUse\" x1=\"850\" y1=\"1087.5\" x2=\"938\" y2=\"1119.5\"><stop offset=\"0\" stop-color=\"#1a1b1d\" stop-opacity=\"0\"/><stop offset=\".5\" stop-color=\"#1a1b1d\" stop-opacity=\".72\"/><stop offset=\"1\" stop-color=\"#1a1b1d\"/></linearGradient>\n<linearGradient id=\"ef-grid-fade-alpha\" gradientUnits=\"userSpaceOnUse\" x1=\"850\" y1=\"1087.5\" x2=\"938\" y2=\"1119.5\"><stop offset=\"0\" stop-color=\"#fff\"/><stop offset=\".5\" stop-color=\"#474747\"/><stop offset=\"1\" stop-color=\"#000\"/></linearGradient>\n<mask id=\"ef-grid-fade-mask\" maskUnits=\"userSpaceOnUse\" x=\"-200\" y=\"-200\" width=\"1600\" height=\"1800\"><rect x=\"-200\" y=\"-200\" width=\"1600\" height=\"1800\" fill=\"url(#ef-grid-fade-alpha)\"/></mask>\n<path id=\"ef-rail-b1\" d=\"M423.5 889.4925L583 855.2\"/>\n<path id=\"ef-rail-b2\" d=\"M527 886.24L583 874.2\"/>\n<path id=\"ef-rail-house\" d=\"M583 855.2L761 816.93\"/>\n<path id=\"ef-rail-grid\" d=\"M580.5 901V974Q580.5 989.5 594 994.4L960 1127.5\"/>\n<path id=\"ef-route-b1\" d=\"M423.5 980.545H562.5\"/>\n<path id=\"ef-route-b2\" d=\"M529 999.545H562.5\"/>\n<path id=\"ef-route-house\" d=\"M597 980.545H757\"/>\n<path id=\"ef-route-solar\" d=\"M561.3 689L563.9 694.4C572.6 712.4 580 728 580 750V827.2\"/>\n<path id=\"ef-route-solar-eave\" d=\"M561.3 689L563.9 694.4C572.6 712.4 580 728 580 750\"/>\n<path id=\"ef-route-solar-front\" d=\"M-2 2H77.2\"/>\n<path id=\"ef-route-solar-side\" d=\"M-1 -4.5H78.6\"/>\n<clipPath id=\"ef-solar-seam\"><rect x=\"550\" y=\"750\" width=\"50\" height=\"90\"/></clipPath>\n<path id=\"ef-route-grid\" d=\"M580.5 903V974Q580.5 989.5 594 994.4L938 1119.5\"/>\n<path id=\"ef-route-grid-riser\" d=\"M580.5 903V974Q580.5 989.5 594 994.4L594.28 994.5\"/>\n<path id=\"ef-route-grid-top\" d=\"M-11 -2H380\"/>\n<path id=\"ef-route-grid-side\" d=\"M-3 4.5H380\"/>\n<clipPath id=\"ef-grid-seam\"><path d=\"M604.25 966.21 583.75 1022.59 1053.65 1193.48 1074.15 1137.1Z\"/></clipPath>\n<g id=\"ef-house-pulse\" transform=\"matrix(1 -.215 0 1 0 0)\">\n  <g class=\"ef-front\" transform=\"translate(0 1.1)\">\n    \n    \n    \n    \n    \n    \n    \n    \n    \n    <use class=\"ef-pulse ef-p10\" href=\"#ef-route-house\"/>\n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    <use class=\"ef-pulse ef-p25\" href=\"#ef-route-house\"/>\n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    <use class=\"ef-pulse ef-p40\" href=\"#ef-route-house\"/>\n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    <use class=\"ef-pulse ef-p51\" href=\"#ef-route-house\"/>\n  </g>\n  <g class=\"ef-top\" transform=\"translate(0 976.10) matrix(1 0 1.76 1 0 0) translate(0 -981.50)\">\n    \n    \n    \n    \n    \n    \n    \n    \n    \n    <use class=\"ef-pulse ef-p10\" href=\"#ef-route-house\"/>\n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    <use class=\"ef-pulse ef-p25\" href=\"#ef-route-house\"/>\n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    <use class=\"ef-pulse ef-p40\" href=\"#ef-route-house\"/>\n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    <use class=\"ef-pulse ef-p51\" href=\"#ef-route-house\"/>\n  </g>\n</g>\n<g id=\"ef-cloudset\">\n<ellipse cx=\"90\" cy=\"46\" rx=\"330\" ry=\"92\" fill=\"url(#ef-c1)\" opacity=\".62\"/>\n<ellipse cx=\"1010\" cy=\"6\" rx=\"250\" ry=\"30\" fill=\"url(#ef-c2)\" opacity=\".8\"/>\n<ellipse cx=\"900\" cy=\"64\" rx=\"360\" ry=\"70\" fill=\"url(#ef-c3)\" opacity=\".42\"/>\n<ellipse cx=\"470\" cy=\"150\" rx=\"300\" ry=\"60\" fill=\"url(#ef-c3)\" opacity=\".22\"/>\n</g>\n<filter id=\"ef-frost-ice\" primitiveUnits=\"userSpaceOnUse\" x=\"-2%\" y=\"-2%\" width=\"104%\" height=\"104%\" color-interpolation-filters=\"sRGB\">\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\".09\" numOctaves=\"3\" seed=\"11\" result=\"patch\"/>\n  <feComposite in=\"SourceGraphic\" in2=\"patch\" operator=\"arithmetic\" k2=\"1.25\" k3=\".5\" k4=\"-.48\" result=\"reach\"/>\n  <feComponentTransfer in=\"reach\" result=\"edge\"><feFuncA type=\"linear\" slope=\"2.2\" intercept=\"-.12\"/></feComponentTransfer>\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\".9\" numOctaves=\"2\" seed=\"4\" result=\"grain\"/>\n  <feColorMatrix in=\"grain\" type=\"matrix\" values=\"0 0 0 0 .9  0 0 0 0 .94  0 0 0 0 .98  1.5 0 0 0 -.72\" result=\"crystals\"/>\n  <feComposite in=\"crystals\" in2=\"edge\" operator=\"in\" result=\"sparkle\"/>\n  <feFlood flood-color=\"#dfe9f3\" flood-opacity=\".3\"/>\n  <feComposite in2=\"edge\" operator=\"in\" result=\"veil\"/>\n  <feMerge><feMergeNode in=\"veil\"/><feMergeNode in=\"sparkle\"/></feMerge>\n</filter>\n<radialGradient id=\"ef-frost-roof\" cx=\".5\" cy=\".5\" r=\".7\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\".42\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\".7\"/></radialGradient>\n<linearGradient id=\"ef-frost-front-foot\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"1144\" x2=\"0\" y2=\"1096\" gradientTransform=\"matrix(1 -.2525 0 1 0 0)\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\".5\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/></linearGradient>\n<linearGradient id=\"ef-frost-gable-foot\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"968\" x2=\"0\" y2=\"925\" gradientTransform=\"matrix(1 .355 0 1 0 0)\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\".55\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/></linearGradient>\n<linearGradient id=\"ef-frost-ground\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"860\" x2=\"0\" y2=\"1408\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\"0\"/><stop offset=\".22\" stop-color=\"#fff\" stop-opacity=\".9\"/><stop offset=\".55\" stop-color=\"#fff\" stop-opacity=\".5\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\".2\"/></linearGradient>\n<filter id=\"ef-frost-rime\" primitiveUnits=\"userSpaceOnUse\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" color-interpolation-filters=\"sRGB\">\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\".0075 .028\" numOctaves=\"4\" seed=\"21\" result=\"patch\"/>\n  <feComposite in=\"SourceGraphic\" in2=\"patch\" operator=\"arithmetic\" k2=\"1\" k3=\"1.3\" k4=\"-1.02\" result=\"reach\"/>\n  <feComponentTransfer in=\"reach\" result=\"edge\"><feFuncA type=\"linear\" slope=\"1.6\" intercept=\"0\"/></feComponentTransfer>\n  <feFlood flood-color=\"#dde7f1\" flood-opacity=\".2\"/>\n  <feComposite in2=\"edge\" operator=\"in\" result=\"veil\"/>\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\".5 1.4\" numOctaves=\"1\" seed=\"5\" result=\"grain\"/>\n  <feColorMatrix in=\"grain\" type=\"matrix\" values=\"0 0 0 0 .95  0 0 0 0 .97  0 0 0 0 1  6 0 0 0 -4.1\" result=\"glints\"/>\n  <feComposite in=\"glints\" in2=\"edge\" operator=\"in\" result=\"sparkle\"/>\n  <feMerge><feMergeNode in=\"veil\"/><feMergeNode in=\"sparkle\"/></feMerge>\n</filter>\n<radialGradient id=\"ef-frost-dot\"><stop offset=\"0\" stop-color=\"#fff\"/><stop offset=\".45\" stop-color=\"#fff\" stop-opacity=\".75\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/></radialGradient>\n<radialGradient id=\"ef-frost-sheet\" cx=\".5\" cy=\".42\" r=\".62\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\".2\"/><stop offset=\".72\" stop-color=\"#fff\" stop-opacity=\".28\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\".66\"/></radialGradient>\n<clipPath id=\"ef-quarter-clip\"><use href=\"#ef-painted-quarter\"/></clipPath>\n<clipPath id=\"ef-painted-bumper-clip\"><use href=\"#ef-painted-bumper\"/></clipPath>\n<clipPath id=\"ef-painted-hatch-clip\"><use href=\"#ef-painted-hatch\"/></clipPath>\n<clipPath id=\"ef-back-windscreen-clip\"><use href=\"#ef-back-windscreen\"/></clipPath>\n<clipPath id=\"ef-garage-opening\"><path d=\"M0 714 235 797.5 235 1047.5 0 964Z\"/></clipPath>\n<path id=\"ef-route-ev\" d=\"M89 905.45C79 906.77 72.5 904.77 68 898.32C62.5 889.59 60.7 872.01 60.7 845.01L60.7 834.01L60 815V740\"/>\n<path id=\"ef-route-ev-cable\" d=\"M89 905.45C79 906.77 72.5 904.77 68 898.32C62.5 889.59 60.7 872.01 60.7 845.01L60.7 834.01\"/>\n<path id=\"ef-route-ev-pipe\" d=\"M60 815V740\"/>\n<linearGradient id=\"ef-garage-side\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"240\" y2=\"0\"><stop offset=\"0\" stop-color=\"#202124\"/><stop offset=\"1\" stop-color=\"#141517\"/></linearGradient>\n<linearGradient id=\"ef-garage-floor\" gradientUnits=\"userSpaceOnUse\" x1=\"150\" y1=\"925\" x2=\"175\" y2=\"1015\"><stop offset=\"0\" stop-color=\"#17181a\"/><stop offset=\"1\" stop-color=\"#2b2c30\"/></linearGradient>\n<radialGradient id=\"ef-garage-vignette\" gradientUnits=\"userSpaceOnUse\" cx=\"95\" cy=\"835\" r=\"200\"><stop offset=\"0\" stop-color=\"#1a1008\" stop-opacity=\"0\"/><stop offset=\".42\" stop-color=\"#1a1008\" stop-opacity=\".04\"/><stop offset=\"1\" stop-color=\"#140e0a\" stop-opacity=\".66\"/></radialGradient>\n<linearGradient id=\"ef-garage-ceiling\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"715\" x2=\"0\" y2=\"850\"><stop offset=\"0\" stop-color=\"#0c0d12\" stop-opacity=\".62\"/><stop offset=\"1\" stop-color=\"#0c0d12\" stop-opacity=\"0\"/></linearGradient>\n<linearGradient id=\"ef-garage-wall-down\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"740\" x2=\"0\" y2=\"960\"><stop offset=\"0\" stop-color=\"#000\" stop-opacity=\"0\"/><stop offset=\"1\" stop-color=\"#000\" stop-opacity=\".14\"/></linearGradient>\n<linearGradient id=\"ef-garage-wall-right\" gradientUnits=\"userSpaceOnUse\" x1=\"96\" y1=\"0\" x2=\"236\" y2=\"0\"><stop offset=\"0\" stop-color=\"#14100d\" stop-opacity=\"0\"/><stop offset=\".44\" stop-color=\"#14100d\" stop-opacity=\".46\"/><stop offset=\"1\" stop-color=\"#14100d\" stop-opacity=\".88\"/></linearGradient>\n<linearGradient id=\"ef-garage-lintel-shade\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-opacity=\".7\"/><stop offset=\"1\" stop-opacity=\"0\"/></linearGradient>\n<radialGradient id=\"ef-garage-lamp\"><stop offset=\"0\" stop-color=\"#ffe9c4\" stop-opacity=\".2\"/><stop offset=\".55\" stop-color=\"#ffe9c4\" stop-opacity=\".06\"/><stop offset=\"1\" stop-color=\"#ffe9c4\" stop-opacity=\"0\"/></radialGradient>\n<linearGradient id=\"ef-garage-slat\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#46484c\"/><stop offset=\".6\" stop-color=\"#36383b\"/><stop offset=\"1\" stop-color=\"#202124\"/></linearGradient>\n<linearGradient id=\"ef-ev-body\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#a3a7ad\"/><stop offset=\".18\" stop-color=\"#7c8086\"/><stop offset=\".6\" stop-color=\"#55595e\"/><stop offset=\"1\" stop-color=\"#2f3236\"/></linearGradient>\n<linearGradient id=\"ef-ev-face\" x1=\"0\" y1=\"0\" x2=\".5\" y2=\"1\"><stop offset=\"0\" stop-color=\"#eceef0\"/><stop offset=\"1\" stop-color=\"#b9bcc1\"/></linearGradient>\n<linearGradient id=\"ef-coat-width\" gradientUnits=\"userSpaceOnUse\" x1=\"25\" y1=\"0\" x2=\"197\" y2=\"0\">\n  <stop stop-color=\"black\"/><stop offset=\"1\" stop-color=\"white\"/>\n</linearGradient>\n<mask id=\"ef-coat-right\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"-245\" width=\"320\" height=\"280\">\n  <rect x=\"0\" y=\"-245\" width=\"320\" height=\"280\" fill=\"url(#ef-coat-width)\"/>\n</mask>\n<linearGradient id=\"ef-bumper-left\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"-136.5\" x2=\"0\" y2=\"-62.2\" gradientTransform=\"matrix(1 0.075 0 1 0 0)\">\n  <stop offset=\"0.00\" stop-color=\"#646770\"/>\n  <stop offset=\"0.17\" stop-color=\"#8b8f99\"/>\n  <stop offset=\"0.33\" stop-color=\"#b8bcc8\"/>\n  <stop offset=\"0.48\" stop-color=\"#eaedf5\"/>\n  <stop offset=\"0.64\" stop-color=\"#9ca0ac\"/>\n  <stop offset=\"0.82\" stop-color=\"#b8bcc8\"/>\n  <stop offset=\"1.00\" stop-color=\"#a2a6b2\"/>\n</linearGradient>\n<linearGradient id=\"ef-bumper-right\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"-85.4\" x2=\"0\" y2=\"-20.6\" gradientTransform=\"matrix(1 -0.195 0 1 0 0)\">\n  <stop offset=\"0.00\" stop-color=\"#52545b\"/>\n  <stop offset=\"0.17\" stop-color=\"#4b4d54\"/>\n  <stop offset=\"0.33\" stop-color=\"#54565e\"/>\n  <stop offset=\"0.50\" stop-color=\"#4b4d54\"/>\n  <stop offset=\"0.67\" stop-color=\"#52545c\"/>\n  <stop offset=\"0.83\" stop-color=\"#494b52\"/>\n  <stop offset=\"1.00\" stop-color=\"#42444a\"/>\n</linearGradient>\n<linearGradient id=\"ef-hatch-left\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"-106.6\" x2=\"0\" y2=\"-73.8\" gradientTransform=\"matrix(1 0.035 0 1 0 0)\">\n  <stop offset=\"0.00\" stop-color=\"#6b6d75\"/>\n  <stop offset=\"0.20\" stop-color=\"#c6cad6\"/>\n  <stop offset=\"0.38\" stop-color=\"#ffffff\"/>\n  <stop offset=\"0.58\" stop-color=\"#848894\"/>\n  <stop offset=\"0.80\" stop-color=\"#747884\"/>\n  <stop offset=\"1.00\" stop-color=\"#7c808c\"/>\n</linearGradient>\n<linearGradient id=\"ef-hatch-right\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"-86.9\" x2=\"0\" y2=\"-47.4\" gradientTransform=\"matrix(1 -0.225 0 1 0 0)\">\n  <stop offset=\"0.00\" stop-color=\"#8b8e98\"/>\n  <stop offset=\"0.20\" stop-color=\"#969cad\"/>\n  <stop offset=\"0.40\" stop-color=\"#c2cbde\"/>\n  <stop offset=\"0.60\" stop-color=\"#949eb0\"/>\n  <stop offset=\"0.80\" stop-color=\"#757c8d\"/>\n  <stop offset=\"1.00\" stop-color=\"#787f8f\"/>\n</linearGradient>\n<linearGradient id=\"ef-deck-left\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"-219\" x2=\"0\" y2=\"-105.9\" gradientTransform=\"matrix(1 -0.005 0 1 0 0)\">\n  <stop stop-color=\"#42444a\"/>\n  <stop offset=\"0.673\" stop-color=\"#abaab0\"/>\n  <stop offset=\"0.719\" stop-color=\"#b8b7bc\"/>\n  <stop offset=\"0.768\" stop-color=\"#c6c5cb\"/>\n  <stop offset=\"0.814\" stop-color=\"#d5d5dc\"/>\n  <stop offset=\"0.859\" stop-color=\"#dce0e8\"/>\n  <stop offset=\"0.905\" stop-color=\"#e1e4ee\"/>\n  <stop offset=\"0.954\" stop-color=\"#e8ecf5\"/>\n  <stop offset=\"1.000\" stop-color=\"#f0f3fa\"/>\n</linearGradient>\n<linearGradient id=\"ef-deck-right\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"-184\" x2=\"0\" y2=\"-79.4\" gradientTransform=\"matrix(1 -0.245 0 1 0 0)\">\n  <stop stop-color=\"#333338\"/>\n  <stop offset=\"0.595\" stop-color=\"#a2a1a6\"/>\n  <stop offset=\"0.651\" stop-color=\"#aeafb6\"/>\n  <stop offset=\"0.712\" stop-color=\"#b8bcc7\"/>\n  <stop offset=\"0.769\" stop-color=\"#c6d0e2\"/>\n  <stop offset=\"0.826\" stop-color=\"#b0bdd4\"/>\n  <stop offset=\"0.882\" stop-color=\"#8d99b0\"/>\n  <stop offset=\"0.943\" stop-color=\"#79869e\"/>\n  <stop offset=\"1.000\" stop-color=\"#747e90\"/>\n</linearGradient>\n<clipPath id=\"ef-painted-deck-clip\"><use href=\"#ef-painted-deck\"/></clipPath>\n<linearGradient id=\"ef-glass-left\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"-82.3\" x2=\"0\" y2=\"-14.8\" gradientTransform=\"matrix(1 -0.775 0 1 0 0)\">\n  <stop offset=\"0.00\" stop-color=\"#3c3d42\"/>\n  <stop offset=\"0.24\" stop-color=\"#25272c\"/>\n  <stop offset=\"0.50\" stop-color=\"#14161a\"/>\n  <stop offset=\"0.76\" stop-color=\"#0b0c0f\"/>\n  <stop offset=\"1.00\" stop-color=\"#040507\"/>\n</linearGradient>\n<linearGradient id=\"ef-glass-right\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"-168.0\" x2=\"0\" y2=\"-110.0\" gradientTransform=\"matrix(1 -0.165 0 1 0 0)\">\n  <stop offset=\"0.00\" stop-color=\"#050608\"/>\n  <stop offset=\"0.25\" stop-color=\"#0b0c0f\"/>\n  <stop offset=\"0.50\" stop-color=\"#0e1014\"/>\n  <stop offset=\"0.75\" stop-color=\"#14161b\"/>\n  <stop offset=\"1.00\" stop-color=\"#22242b\"/>\n</linearGradient>\n<linearGradient id=\"ef-quarter-left\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"-147.0\" x2=\"0\" y2=\"-103.1\" gradientTransform=\"matrix(1 -0.075 0 1 0 0)\">\n  <stop offset=\"0.00\" stop-color=\"#61656f\"/>\n  <stop offset=\"0.25\" stop-color=\"#787d8a\"/>\n  <stop offset=\"0.50\" stop-color=\"#939aab\"/>\n  <stop offset=\"0.75\" stop-color=\"#aab3ca\"/>\n  <stop offset=\"1.00\" stop-color=\"#b1bdda\"/>\n</linearGradient>\n<linearGradient id=\"ef-quarter-right\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"-116.3\" x2=\"0\" y2=\"-79.9\" gradientTransform=\"matrix(1 -0.235 0 1 0 0)\">\n  <stop offset=\"0.00\" stop-color=\"#4e5057\"/>\n  <stop offset=\"0.25\" stop-color=\"#53565c\"/>\n  <stop offset=\"0.50\" stop-color=\"#696d79\"/>\n  <stop offset=\"0.75\" stop-color=\"#666b77\"/>\n  <stop offset=\"1.00\" stop-color=\"#484c53\"/>\n</linearGradient>\n<linearGradient id=\"ef-car-glow\" gradientUnits=\"userSpaceOnUse\" x1=\"156.7\" y1=\"-106.8\" x2=\"159.5\" y2=\"-97.6\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\"0\"/><stop offset=\"0.3\" stop-color=\"#fff\" stop-opacity=\"0.28\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/></linearGradient>\n<linearGradient id=\"ef-car-recess\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"-52.6\" x2=\"0\" y2=\"-31.4\"><stop offset=\"0\" stop-color=\"#121315\"/><stop offset=\"0.3\" stop-color=\"#1e2022\"/><stop offset=\"1\" stop-color=\"#2a2c2e\"/></linearGradient>\n<linearGradient id=\"ef-car-lip\" gradientUnits=\"userSpaceOnUse\" x1=\"156.7\" y1=\"-48.4\" x2=\"159.4\" y2=\"-37.8\"><stop offset=\"0\" stop-color=\"#17181a\"/><stop offset=\"0.55\" stop-color=\"#2b2d30\"/><stop offset=\"1\" stop-color=\"#111214\"/></linearGradient>\n<linearGradient id=\"ef-car-plate\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0\" stop-color=\"#e2e4e7\"/><stop offset=\"1\" stop-color=\"#c3c6ca\"/></linearGradient>\n<linearGradient id=\"ef-ev-glass\" x1=\"0\" y1=\"0\" x2=\".4\" y2=\"1\"><stop offset=\"0\" stop-color=\"#2a2d33\"/><stop offset=\"1\" stop-color=\"#15161a\"/></linearGradient>\n<linearGradient id=\"ef-window-reflection-fade\" gradientUnits=\"userSpaceOnUse\" x1=\"844\" y1=\"935\" x2=\"844\" y2=\"1195\"><stop offset=\"0\" stop-color=\"#fff\" stop-opacity=\".16\"/><stop offset=\".20\" stop-color=\"#fff\"/><stop offset=\".62\" stop-color=\"#fff\" stop-opacity=\".46\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/></linearGradient>\n<mask id=\"ef-window-reflection-mask\" maskUnits=\"userSpaceOnUse\" x=\"720\" y=\"890\" width=\"250\" height=\"320\"><rect x=\"720\" y=\"890\" width=\"250\" height=\"320\" fill=\"url(#ef-window-reflection-fade)\"/></mask>\n<linearGradient id=\"ef-lintel-shade\" gradientUnits=\"userSpaceOnUse\" x1=\"112\" y1=\"756\" x2=\"97.3\" y2=\"797.5\"><stop offset=\"0\" stop-color=\"#151926\" stop-opacity=\".62\"/><stop offset=\".35\" stop-color=\"#151926\" stop-opacity=\".2\"/><stop offset=\"1\" stop-color=\"#151926\" stop-opacity=\"0\"/></linearGradient>\n<linearGradient id=\"ef-corner-shade\" gradientUnits=\"userSpaceOnUse\" x1=\"290\" y1=\"0\" x2=\"345\" y2=\"0\"><stop offset=\"0\" stop-color=\"#26241f\" stop-opacity=\".08\"/><stop offset=\"1\" stop-color=\"#26241f\" stop-opacity=\"0\"/></linearGradient>\n<radialGradient id=\"ef-clearcoat-roll\">\n  <stop stop-color=\"#f7f9ff\" stop-opacity=\".95\"/><stop offset=\".34\" stop-color=\"#dce1ee\" stop-opacity=\".68\"/>\n  <stop offset=\".72\" stop-color=\"#b0b6c4\" stop-opacity=\".22\"/><stop offset=\"1\" stop-color=\"#a0a4b1\" stop-opacity=\"0\"/>\n</radialGradient>\n<linearGradient id=\"ef-diffuser-blade\" x1=\"0\" y1=\"0\" x2=\".69\" y2=\"1\">\n  <stop stop-color=\"#52535c\"/><stop offset=\".46\" stop-color=\"#3c3d45\"/><stop offset=\".64\" stop-color=\"#2e2f36\"/>\n  <stop offset=\".9\" stop-color=\"#202126\"/><stop offset=\"1\" stop-color=\"#18191d\"/>\n</linearGradient>\n<linearGradient id=\"ef-car-floor-fall\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"-72\" x2=\"0\" y2=\"58\"><stop offset=\"0\" stop-color=\"#0c0d10\" stop-opacity=\".97\"/><stop offset=\".5\" stop-color=\"#0e0f12\" stop-opacity=\".74\"/><stop offset=\"1\" stop-color=\"#16171a\" stop-opacity=\"0\"/></linearGradient>\n<radialGradient id=\"ef-tyre-shadow\"><stop stop-color=\"#141416\" stop-opacity=\".86\"/><stop offset=\".55\" stop-color=\"#1e1e20\" stop-opacity=\".55\"/><stop offset=\"1\" stop-color=\"#28282b\" stop-opacity=\"0\"/></radialGradient>\n<linearGradient id=\"ef-car-shade\" gradientUnits=\"userSpaceOnUse\" x1=\"36\" y1=\"0\" x2=\"215\" y2=\"0\"><stop offset=\"0\" stop-color=\"#141416\" stop-opacity=\"0.32\"/><stop offset=\"0.12\" stop-color=\"#141416\" stop-opacity=\"0.58\"/><stop offset=\"0.35\" stop-color=\"#141416\" stop-opacity=\"0.72\"/><stop offset=\"1\" stop-color=\"#141416\" stop-opacity=\"0.76\"/></linearGradient>\n<filter id=\"ef-car-fall-blur\" filterUnits=\"userSpaceOnUse\" x=\"-50\" y=\"-130\" width=\"320\" height=\"260\" color-interpolation-filters=\"sRGB\"><feGaussianBlur stdDeviation=\"11\"/></filter>\n<filter id=\"ef-car-shade-blur\" filterUnits=\"userSpaceOnUse\" x=\"10\" y=\"-130\" width=\"260\" height=\"170\" color-interpolation-filters=\"sRGB\"><feGaussianBlur stdDeviation=\"4.8\"/></filter>\n<filter id=\"ef-car-touch\" x=\"-20%\" y=\"-80%\" width=\"140%\" height=\"260%\" color-interpolation-filters=\"sRGB\"><feGaussianBlur stdDeviation=\"1.6\"/></filter>\n<filter id=\"ef-array-shadow\" x=\"-.1\" y=\"-.1\" width=\"1.2\" height=\"1.2\"><feGaussianBlur stdDeviation=\"2.25\"/></filter>\n<filter id=\"ef-material-noise\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" color-interpolation-filters=\"sRGB\">\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\".68\" numOctaves=\"2\" stitchTiles=\"stitch\"/>\n  <feColorMatrix type=\"saturate\" values=\"0\"/>\n</filter>\n<filter id=\"ef-stucco\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\" color-interpolation-filters=\"sRGB\">\n  <feTurbulence type=\"fractalNoise\" baseFrequency=\"1.05 1.35\" numOctaves=\"2\" seed=\"19\" stitchTiles=\"stitch\"/>\n  <feDiffuseLighting surfaceScale=\"1.15\" diffuseConstant=\"1.06\" lighting-color=\"#e6e7f0\"><feDistantLight azimuth=\"244\" elevation=\"45\"/></feDiffuseLighting>\n</filter>\n<pattern id=\"ef-stucco-relief\" patternUnits=\"userSpaceOnUse\" width=\"160\" height=\"160\">\n  <rect width=\"160\" height=\"160\" filter=\"url(#ef-stucco)\"/>\n</pattern>\n<pattern id=\"ef-render-grain\" patternUnits=\"userSpaceOnUse\" width=\"96\" height=\"96\">\n  <rect width=\"96\" height=\"96\" filter=\"url(#ef-material-noise)\"/>\n</pattern>\n<pattern id=\"ef-polished-grain\" href=\"#ef-render-grain\" patternTransform=\"scale(3.8 .56)\"/>\n<radialGradient id=\"ef-garage-light\">\n  <stop stop-color=\"#fff0cc\"/><stop offset=\".38\" stop-color=\"#f5d2a4\" stop-opacity=\".86\"/>\n  <stop offset=\".72\" stop-color=\"#dbb082\" stop-opacity=\".40\"/><stop offset=\"1\" stop-color=\"#ce9f72\" stop-opacity=\"0\"/>\n</radialGradient>\n<linearGradient id=\"ef-window-casing\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\".8\">\n  <stop stop-color=\"#4e5056\"/><stop offset=\".32\" stop-color=\"#35373c\"/><stop offset=\".78\" stop-color=\"#43454b\"/><stop offset=\"1\" stop-color=\"#2c2e33\"/>\n</linearGradient>\n<linearGradient id=\"ef-pane-reveal\" x1=\"0\" y1=\"0\" x2=\".72\" y2=\"1\">\n  <stop stop-color=\"#1b1c20\"/><stop offset=\".46\" stop-color=\"#584e44\"/><stop offset=\"1\" stop-color=\"#e8d4b2\"/>\n</linearGradient>\n<linearGradient id=\"ef-wall-bounce\" x1=\"0\" y1=\".2\" x2=\".94\" y2=\".8\">\n  <stop stop-color=\"#fff\" stop-opacity=\".09\"/><stop offset=\".46\" stop-color=\"#fff\" stop-opacity=\"0\"/>\n  <stop offset=\"1\" stop-color=\"#76798d\" stop-opacity=\".07\"/>\n</linearGradient>\n<clipPath id=\"ef-facade-clip\"><path d=\"M289 806 946 664.745 947.5 922 290 1071Z\"/></clipPath>\n<linearGradient id=\"ef-plinth-front\" gradientUnits=\"userSpaceOnUse\" x1=\"290\" y1=\"0\" x2=\"948\" y2=\"0\">\n  <stop stop-color=\"var(--ef-plinth-end,#6c6e74)\"/><stop offset=\".14\" stop-color=\"var(--ef-plinth-shade,#606268)\"/>\n  <stop offset=\".43\" stop-color=\"var(--ef-plinth-shadow,#585a60)\"/><stop offset=\".67\" stop-color=\"var(--ef-plinth-mid,#6e7076)\"/>\n  <stop offset=\".83\" stop-color=\"var(--ef-plinth-mid,#686a70)\"/><stop offset=\"1\" stop-color=\"var(--ef-plinth-end,#72747a)\"/>\n</linearGradient>\n<linearGradient id=\"ef-plinth-return\" x2=\"1\" y2=\".35\">\n  <stop stop-color=\"var(--ef-plinth-jamb,#5c5f68)\"/><stop offset=\".32\" stop-color=\"var(--ef-plinth-side,#6c707a)\"/>\n  <stop offset=\"1\" stop-color=\"var(--ef-plinth-side,#727680)\"/>\n</linearGradient>\n<linearGradient id=\"ef-cast-fade\" gradientUnits=\"userSpaceOnUse\" x1=\"845\" y1=\"0\" x2=\"960\" y2=\"0\">\n  <stop stop-color=\"white\"/><stop offset=\".55\" stop-color=\"#d3d3d3\"/><stop offset=\"1\" stop-color=\"black\"/>\n</linearGradient>\n<mask id=\"ef-cast-mask\" maskUnits=\"userSpaceOnUse\" x=\"536\" y=\"878\" width=\"430\" height=\"275\">\n  <rect x=\"536\" y=\"878\" width=\"430\" height=\"275\" fill=\"url(#ef-cast-fade)\"/>\n</mask>\n<filter id=\"ef-contact-shadow\" x=\"-15%\" y=\"-30%\" width=\"130%\" height=\"160%\"><feGaussianBlur stdDeviation=\"1.0\"/></filter>\n<filter id=\"ef-cast-shadow\" filterUnits=\"userSpaceOnUse\" x=\"220\" y=\"655\" width=\"805\" height=\"530\"><feGaussianBlur stdDeviation=\"3.2\"/></filter>\n<filter id=\"ef-wall-shadow\" filterUnits=\"userSpaceOnUse\" x=\"245\" y=\"645\" width=\"750\" height=\"465\"><feGaussianBlur stdDeviation=\"4.0\"/></filter>\n<clipPath id=\"ef-floor-plane\"><path d=\"M0 967 290 1072 948 929Q1035 907 1170 909V1408H0Z\"/></clipPath>\n<filter id=\"ef-eave-penumbra\" x=\"-10%\" y=\"-40%\" width=\"120%\" height=\"180%\"><feGaussianBlur stdDeviation=\"6.8\"/></filter>\n<filter id=\"ef-glazing-shadow\" x=\"-25%\" y=\"-25%\" width=\"150%\" height=\"150%\"><feGaussianBlur stdDeviation=\"1.8\"/></filter>\n<linearGradient id=\"ef-pane-day-grad\" gradientUnits=\"userSpaceOnUse\" x1=\"912\" y1=\"714\" x2=\"774\" y2=\"870\">\n  <stop offset=\"0\" stop-color=\"#fae8c5\"/>\n  <stop offset=\".34\" stop-color=\"#f5dfb4\"/>\n  <stop offset=\".68\" stop-color=\"#e8cfa6\"/>\n  <stop offset=\"1\" stop-color=\"#dac098\"/>\n</linearGradient>\n<radialGradient id=\"ef-pane-night-grad\" gradientUnits=\"userSpaceOnUse\" cx=\"844\" cy=\"788\" r=\"126\">\n  <stop offset=\"0\" stop-color=\"#fffbe0\"/>\n  <stop offset=\".38\" stop-color=\"#ffeab0\"/>\n  <stop offset=\".74\" stop-color=\"#fad398\"/>\n  <stop offset=\"1\" stop-color=\"#f4c78d\"/>\n</radialGradient>\n<radialGradient id=\"ef-pane-night-lift\" gradientUnits=\"userSpaceOnUse\" cx=\"888\" cy=\"738\" r=\"78\">\n  <stop offset=\"0\" stop-color=\"#fff8dc\" stop-opacity=\".48\"/>\n  <stop offset=\"1\" stop-color=\"#ffe9b2\" stop-opacity=\"0\"/>\n</radialGradient>\n<clipPath id=\"ef-light-panes-clip\"><path d=\"M769.5 743.5 837.5 728.88 837.5 787.28 769.5 801.9ZM851.5 725.87 919 711.3575 919 769.7575 851.5 784.27ZM769.5 814.1 837.5 799.48 837.5 858.18 769.5 872.8ZM851.5 796.47 919 781.9575 919 840.6575 851.5 855.17Z\"/></clipPath>\n<linearGradient id=\"ef-floor-fade\" x2=\"0\" y2=\"1\">\n  <stop offset=\"0\" stop-color=\"white\" stop-opacity=\"0\"/><stop offset=\".18\" stop-color=\"white\" stop-opacity=\".22\"/>\n  <stop offset=\".38\" stop-color=\"white\" stop-opacity=\".78\"/><stop offset=\".54\" stop-color=\"white\"/>\n</linearGradient>\n<mask id=\"ef-floor-horizon\" maskUnits=\"userSpaceOnUse\" x=\"0\" y=\"680\" width=\"1170\" height=\"728\">\n  <rect y=\"680\" width=\"1170\" height=\"728\" fill=\"url(#ef-floor-fade)\"/>\n</mask>\n<linearGradient id=\"ef-grain-fade\" x2=\"0\" y2=\"1\">\n  <stop stop-color=\"#fff\" stop-opacity=\"0\"/><stop offset=\".25\" stop-color=\"#fff\"/>\n  <stop offset=\".7\" stop-color=\"#fff\" stop-opacity=\".6\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/>\n</linearGradient>\n<mask id=\"ef-ground-grain-fade\" x=\"0\" y=\"0\" width=\"100%\" height=\"100%\"><rect y=\"880\" width=\"1170\" height=\"528\" fill=\"url(#ef-grain-fade)\"/></mask>\n<linearGradient id=\"ef-garage-sill\" gradientUnits=\"userSpaceOnUse\" x2=\"0\" y2=\"4.2\" gradientTransform=\"matrix(1 .35532 0 1 0 963.2)\">\n  <stop stop-color=\"#f2f4fa\"/><stop offset=\".25\" stop-color=\"#c9ccd6\"/><stop offset=\".8\" stop-color=\"#a2a5b0\"/><stop offset=\"1\" stop-color=\"#d8dbe4\"/>\n</linearGradient>\n<linearGradient id=\"ef-rake-metal\" x2=\"1\" y2=\".4\">\n  <stop stop-color=\"#5c5f6a\"/><stop offset=\".4\" stop-color=\"#707480\"/><stop offset=\"1\" stop-color=\"#4c4f5a\"/>\n</linearGradient>\n<linearGradient id=\"ef-fascia-metal\" gradientUnits=\"userSpaceOnUse\" x2=\"0\" y2=\"10\" gradientTransform=\"matrix(1 -.22334 0 1 0 864.4)\">\n  <stop stop-color=\"#6b6e78\"/><stop offset=\".16\" stop-color=\"#545762\"/><stop offset=\".74\" stop-color=\"#484b56\"/><stop offset=\"1\" stop-color=\"#32353f\"/>\n</linearGradient>\n<linearGradient id=\"ef-jamb-return\"><stop stop-color=\"#8b8d96\"/><stop offset=\".53\" stop-color=\"#585a64\"/><stop offset=\"1\" stop-color=\"#74767e\"/></linearGradient>\n<linearGradient id=\"ef-wall-foot-fade\" gradientUnits=\"userSpaceOnUse\" x1=\"430\" y1=\"0\" x2=\"640\" y2=\"0\"><stop offset=\"0\" stop-color=\"#fff\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/></linearGradient>\n<mask id=\"ef-wall-foot-mask\" maskUnits=\"userSpaceOnUse\" x=\"280\" y=\"650\" width=\"680\" height=\"430\"><rect x=\"280\" y=\"650\" width=\"680\" height=\"430\" fill=\"url(#ef-wall-foot-fade)\"/></mask>\n<linearGradient id=\"ef-wall-foot\" gradientUnits=\"userSpaceOnUse\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"270\" gradientTransform=\"matrix(1 -.2207 0 1 0 806)\"><stop offset=\"0\" stop-color=\"#2c3040\" stop-opacity=\"0\"/><stop offset=\".5\" stop-color=\"#2c3040\" stop-opacity=\".04\"/><stop offset=\"1\" stop-color=\"#2c3040\" stop-opacity=\".14\"/></linearGradient>\n<linearGradient id=\"ef-wall-right\" gradientUnits=\"userSpaceOnUse\" x1=\"560\" y1=\"0\" x2=\"946\" y2=\"0\"><stop offset=\"0\" stop-color=\"#2a2c36\" stop-opacity=\"0\"/><stop offset=\"1\" stop-color=\"#2a2c36\" stop-opacity=\".1\"/></linearGradient>\n<filter id=\"ef-ao-blur\" x=\"-10%\" y=\"-60%\" width=\"120%\" height=\"220%\"><feGaussianBlur stdDeviation=\"2.8\"/></filter>\n<linearGradient id=\"ef-eave-shade\" gradientUnits=\"userSpaceOnUse\" x1=\"620\" y1=\"731\" x2=\"627.5\" y2=\"766\"><stop offset=\"0\" stop-color=\"#141620\" stop-opacity=\".64\"/><stop offset=\".26\" stop-color=\"#202230\" stop-opacity=\".34\"/><stop offset=\".60\" stop-color=\"#242533\" stop-opacity=\".11\"/><stop offset=\"1\" stop-color=\"#26241f\" stop-opacity=\"0\"/></linearGradient>\n<linearGradient id=\"ef-rake-shade\" gradientUnits=\"userSpaceOnUse\" x1=\"180\" y1=\"660\" x2=\"169\" y2=\"668.4\"><stop offset=\"0\" stop-color=\"#1c1e28\" stop-opacity=\".50\"/><stop offset=\".35\" stop-color=\"#232530\" stop-opacity=\".22\"/><stop offset=\"1\" stop-color=\"#26241f\" stop-opacity=\"0\"/></linearGradient><linearGradient id=\"ef-rake-shade-l\" gradientUnits=\"userSpaceOnUse\" x1=\"35\" y1=\"540.8\" x2=\"40.5\" y2=\"547.8\"><stop offset=\"0\" stop-color=\"#1c1e28\" stop-opacity=\".46\"/><stop offset=\".35\" stop-color=\"#232530\" stop-opacity=\".20\"/><stop offset=\"1\" stop-color=\"#26241f\" stop-opacity=\"0\"/></linearGradient>\n<radialGradient id=\"ef-window-spill-g\" cx=\".5\" cy=\".5\" r=\".5\"><stop offset=\"0\" stop-color=\"#ffdfa8\" stop-opacity=\".76\"/><stop offset=\".48\" stop-color=\"#f4be82\" stop-opacity=\".38\"/><stop offset=\"1\" stop-color=\"#e2a46c\" stop-opacity=\"0\"/></radialGradient>\n<radialGradient id=\"ef-strip-spill\" cx=\".5\" cy=\".5\" r=\".5\"><stop offset=\"0\" style=\"stop-color:var(--ef-b1-color,#84e88a)\" stop-opacity=\".36\"/><stop offset=\".50\" style=\"stop-color:var(--ef-b1-color,#84e88a)\" stop-opacity=\".14\"/><stop offset=\"1\" style=\"stop-color:var(--ef-b1-color,#84e88a)\" stop-opacity=\"0\"/></radialGradient>\n<radialGradient id=\"ef-strip-spill-b2\" cx=\".5\" cy=\".5\" r=\".5\"><stop offset=\"0\" style=\"stop-color:var(--ef-b2-color,#64b8ff)\" stop-opacity=\".34\"/><stop offset=\".50\" style=\"stop-color:var(--ef-b2-color,#64b8ff)\" stop-opacity=\".13\"/><stop offset=\"1\" style=\"stop-color:var(--ef-b2-color,#64b8ff)\" stop-opacity=\"0\"/></radialGradient>\n<filter id=\"ef-led-reflection\" x=\"-150%\" y=\"-40%\" width=\"400%\" height=\"180%\"><feGaussianBlur stdDeviation=\"3.4 9.0\"/></filter>\n<filter id=\"ef-led-bloom\" x=\"-200%\" y=\"-40%\" width=\"500%\" height=\"180%\"><feGaussianBlur stdDeviation=\"7 14\"/></filter>\n<filter id=\"ef-rim-shadow\" x=\"-25%\" y=\"-25%\" width=\"150%\" height=\"150%\"><feGaussianBlur stdDeviation=\"2.2\"/></filter>\n<filter id=\"ef-reflection-soft\" x=\"-60%\" y=\"-60%\" width=\"220%\" height=\"220%\"><feGaussianBlur stdDeviation=\"6.2 16\"/></filter>\n<filter id=\"ef-reflection-blur\" x=\"-40%\" y=\"-40%\" width=\"180%\" height=\"180%\"><feGaussianBlur stdDeviation=\"5 9.5\"/></filter>\n</defs>\n<g id=\"ef-scene\">\n<g class=\"ef-bake\">\n<rect width=\"1170\" height=\"1408\" fill=\"url(#ef-sky)\"/>\n<rect id=\"ef-clear\" width=\"1170\" height=\"900\" fill=\"url(#ef-clear-g)\"/>\n<rect id=\"ef-night\" width=\"1170\" height=\"1000\" fill=\"url(#ef-night-g)\"/>\n<ellipse id=\"ef-twilight\" cx=\"0\" cy=\"187\" rx=\"510\" ry=\"240\" fill=\"url(#ef-twilight-g)\"/>\n</g>\n<g id=\"ef-stars\" fill=\"#fff\"><circle cx=\"260.0\" cy=\"92.9\" r=\"1.3\" style=\"animation-duration:4.1s;animation-delay:-0.6s\"/><circle cx=\"202.1\" cy=\"140.5\" r=\"1.3\" style=\"animation-duration:5.3s;animation-delay:-0.4s\"/><circle cx=\"167.5\" cy=\"78.3\" r=\"1.3\" style=\"animation-duration:4.9s;animation-delay:-1.8s\"/><circle cx=\"112.7\" cy=\"83.2\" r=\"1.2\" style=\"animation-duration:3.2s;animation-delay:-1.6s\"/><circle cx=\"70.0\" cy=\"23.5\" r=\"1.0\" style=\"animation-duration:3.1s;animation-delay:-1.4s\"/><circle cx=\"688.2\" cy=\"41.2\" r=\"1.4\" style=\"animation-duration:3.2s;animation-delay:-0.3s\"/><circle cx=\"690.0\" cy=\"102.3\" r=\"1.3\" style=\"animation-duration:4.5s;animation-delay:-3.7s\"/><circle cx=\"602.7\" cy=\"122.8\" r=\"1.3\" style=\"animation-duration:3.4s;animation-delay:-0.8s\"/><circle cx=\"578.4\" cy=\"78.3\" r=\"1.0\" style=\"animation-duration:5.2s;animation-delay:-4.9s\"/><circle cx=\"518.5\" cy=\"68.9\" r=\"1.4\" style=\"animation-duration:5.0s;animation-delay:-2.0s\"/><circle cx=\"470.5\" cy=\"57.3\" r=\"1.3\" style=\"animation-duration:6.4s;animation-delay:-0.3s\"/><circle cx=\"400.0\" cy=\"88.8\" r=\"1.4\" style=\"animation-duration:6.0s;animation-delay:-1.7s\"/><circle cx=\"806.3\" cy=\"63.4\" r=\"1.2\" style=\"animation-duration:3.5s;animation-delay:-0.4s\"/><circle cx=\"786.0\" cy=\"66.1\" r=\"1.0\" style=\"animation-duration:4.1s;animation-delay:-3.3s\"/><circle cx=\"838.2\" cy=\"63.0\" r=\"0.9\" style=\"animation-duration:3.6s;animation-delay:-2.1s\"/><circle cx=\"826.6\" cy=\"49.5\" r=\"0.9\" style=\"animation-duration:5.2s;animation-delay:-1.9s\"/><circle cx=\"820.1\" cy=\"71.7\" r=\"0.8\" style=\"animation-duration:4.9s;animation-delay:-0.3s\"/><circle cx=\"833.8\" cy=\"44.3\" r=\"0.8\" style=\"animation-duration:3.2s;animation-delay:-0.7s\"/><circle cx=\"844.0\" cy=\"53.7\" r=\"0.7\" style=\"animation-duration:5.4s;animation-delay:-2.3s\"/><circle cx=\"975.9\" cy=\"124.8\" r=\"1.8\" style=\"animation-duration:4.1s;animation-delay:-2.4s\"/><circle cx=\"1063.2\" cy=\"137.5\" r=\"1.5\" style=\"animation-duration:4.6s;animation-delay:-1.4s\"/><circle cx=\"1034.3\" cy=\"95.0\" r=\"1.0\" style=\"animation-duration:5.8s;animation-delay:-4.0s\"/><circle cx=\"1017.9\" cy=\"234.2\" r=\"1.4\" style=\"animation-duration:3.9s;animation-delay:-2.2s\"/><circle cx=\"1030.9\" cy=\"225.6\" r=\"1.5\" style=\"animation-duration:4.8s;animation-delay:-4.2s\"/><circle cx=\"1043.3\" cy=\"215.1\" r=\"1.3\" style=\"animation-duration:5.6s;animation-delay:-1.6s\"/><circle cx=\"1033.4\" cy=\"280.4\" r=\"1.2\" style=\"animation-duration:6.4s;animation-delay:-0.8s\"/><circle cx=\"997.5\" cy=\"325.0\" r=\"1.4\" style=\"animation-duration:4.5s;animation-delay:-3.4s\"/><circle cx=\"1094.1\" cy=\"307.8\" r=\"1.9\" style=\"animation-duration:3.5s;animation-delay:-1.7s\"/></g>\n<g class=\"ef-bake\">\n<g id=\"ef-moon\" class=\"ef-celestial\">\n  <title id=\"ef-moon-title\">Moon</title>\n  <circle id=\"ef-moon-halo\" r=\"105\" fill=\"url(#ef-c6)\" opacity=\"0\"/>\n  <circle r=\"22\" fill=\"#333e51\" opacity=\".52\"/>\n  <g clip-path=\"url(#ef-moon-lit)\">\n    <circle r=\"22\" fill=\"url(#ef-moon-disc)\"/>\n    <path d=\"M-18-5Q-19-12-12-13L-6-10-1-11 4-7 1-2-5 1-12-2ZM8-2 14 0 16 5 13 9 8 8 4 4ZM-9 5-4 3 1 6 0 10-5 13-10 10Z\" fill=\"#69768a\" opacity=\".32\"/>\n    <g fill=\"#758296\" opacity=\".45\"><circle cx=\"9\" cy=\"-12\" r=\"2.3\"/><circle cx=\"12\" cy=\"11\" r=\"2.5\"/><circle cx=\"-12\" cy=\"12\" r=\"1.7\"/><circle cx=\"1\" cy=\"15\" r=\"2\"/></g>\n  </g>\n</g>\n<g id=\"ef-sun\" class=\"ef-celestial\">\n  <circle r=\"172\" fill=\"url(#ef-c7)\" opacity=\".56\"/>\n  <circle r=\"52\" fill=\"url(#ef-c7)\" opacity=\".55\"/>\n  <circle r=\"22\" fill=\"url(#ef-sun-disc)\"/>\n</g>\n<ellipse id=\"ef-glow\" cx=\"748\" cy=\"16\" rx=\"270\" ry=\"104\" fill=\"url(#ef-c4)\" opacity=\".74\"/>\n</g>\n<g id=\"ef-clouds\"><g id=\"ef-drift\">\n<use href=\"#ef-cloudset\" x=\"-2340\"/><use href=\"#ef-cloudset\" x=\"-1170\"/><use href=\"#ef-cloudset\"/><use href=\"#ef-cloudset\" x=\"1170\"/>\n</g></g>\n<rect id=\"ef-flash\" width=\"1170\" height=\"900\" fill=\"url(#ef-flash-g)\"/>\n<g class=\"ef-light-only ef-bake\" mask=\"url(#ef-floor-horizon)\">\n  <rect y=\"680\" width=\"1170\" height=\"728\" fill=\"url(#ef-slab)\"/>\n  <rect y=\"680\" width=\"1170\" height=\"728\" fill=\"url(#ef-slab-right-tint)\"/>\n  <ellipse cx=\"1015\" cy=\"1075\" rx=\"280\" ry=\"175\" transform=\"rotate(-12 1015 1075)\" fill=\"url(#ef-ground-sheen-r)\"/>\n  <g>\n    <ellipse cx=\"520\" cy=\"1005\" rx=\"680\" ry=\"192\" transform=\"rotate(-8 520 1005)\" fill=\"url(#ef-slab-shade)\"/>\n    <ellipse cx=\"860\" cy=\"952\" rx=\"185\" ry=\"52\" transform=\"rotate(-12 860 952)\" fill=\"url(#ef-slab-shade)\" opacity=\".52\"/>\n    <ellipse cx=\"990\" cy=\"935\" rx=\"108\" ry=\"30\" transform=\"rotate(-14 990 935)\" fill=\"url(#ef-corner-shadow-tail)\" opacity=\"0.75\" style=\"opacity:calc(.75 + .25 * var(--ef-darkness,0))\"/>\n    <path d=\"M-25 956 288 1072 948 926\" fill=\"none\" stroke=\"#2c2e36\" stroke-opacity=\".17\" stroke-width=\"30\" filter=\"url(#ef-floor-soft)\"/>\n  </g>\n</g>\n<g class=\"ef-frost\"><rect y=\"860\" width=\"1170\" height=\"548\" fill=\"url(#ef-frost-ground)\" filter=\"url(#ef-frost-rime)\"/></g>\n<g id=\"ef-shadow\" class=\"ef-bake\"><polygon points=\"-100,932.5 290,1071 306,1206 -84,1067.5\" fill=\"url(#ef-sh-g0)\"/><polygon points=\"290,1071 947.5,905 963.5,1040 306,1206\" fill=\"url(#ef-sh-f0)\"/><polygon points=\"-100,932.5 290,1071 334,1206 -56,1067.5\" fill=\"url(#ef-sh-g1)\"/><polygon points=\"290,1071 947.5,905 991.5,1040 334,1206\" fill=\"url(#ef-sh-f1)\"/><polygon points=\"-100,932.5 290,1071 364,1206 -26,1067.5\" fill=\"url(#ef-sh-g2)\"/><polygon points=\"290,1071 947.5,905 1021.5,1040 364,1206\" fill=\"url(#ef-sh-f2)\"/></g>\n<g class=\"ef-light-only ef-bake\">\n  <g clip-path=\"url(#ef-floor-plane)\">\n    <path d=\"M-16 964 229 1052 290 1073 948 929\" stroke=\"#303446\" stroke-width=\"38\" opacity=\".26\" fill=\"none\" filter=\"url(#ef-floor-soft)\"/>\n    <path d=\"M231 1052 290 1073 948 929\" fill=\"none\" stroke=\"#2f3548\" stroke-width=\"24\" opacity=\".20\" filter=\"url(#ef-floor-soft)\"/>\n  </g>\n  <g class=\"ef-garage-spill\" clip-path=\"url(#ef-floor-plane)\">\n    <g filter=\"url(#ef-polished-reflection)\">\n      <ellipse cx=\"96\" cy=\"1112\" rx=\"150\" ry=\"125\" fill=\"url(#ef-reflected-light)\" filter=\"url(#ef-spill-blur-c)\" opacity=\"0.07\" style=\"opacity:calc(.07 + .20 * var(--ef-darkness,0))\"/>\n      <ellipse cx=\"92\" cy=\"1076\" rx=\"82\" ry=\"68\" fill=\"url(#ef-reflected-light)\" filter=\"url(#ef-spill-blur-b)\" opacity=\"0.12\" style=\"opacity:calc(.12 + .28 * var(--ef-darkness,0))\"/>\n      <ellipse cx=\"90\" cy=\"1046\" rx=\"38\" ry=\"30\" fill=\"url(#ef-reflected-light)\" filter=\"url(#ef-spill-blur-a)\" opacity=\"0.22\" style=\"opacity:calc(.22 + .36 * var(--ef-darkness,0))\"/>\n    </g>\n  </g>\n  <g class=\"ef-pane-spill\" clip-path=\"url(#ef-floor-plane)\">\n    <g filter=\"url(#ef-polished-reflection)\">\n      <ellipse cx=\"846\" cy=\"1105\" rx=\"120\" ry=\"52\" fill=\"url(#ef-window-floor-pool)\" opacity=\"0.1\" style=\"opacity:calc(.10 + .20 * var(--ef-darkness,0))\"/>\n      <path d=\"M771 1190 836.5 1175.9175 836.5 1119.6175 771 1133.7ZM852.5 1172.4775 917.5 1158.5025 917.5 1102.2025 852.5 1116.1775ZM771 1118.7 836.5 1104.6175 836.5 1048.4175 771 1062.5ZM852.5 1101.1775 917.5 1087.2025 917.5 1031.0025 852.5 1044.9775Z\" fill=\"url(#ef-window-mirror-a)\" filter=\"url(#ef-pane-mirror-a)\" opacity=\"0.55\" style=\"opacity:calc(.55 + .45 * var(--ef-darkness,0))\"/>\n      <path d=\"M771 1190 836.5 1175.9175 836.5 1119.6175 771 1133.7ZM852.5 1172.4775 917.5 1158.5025 917.5 1102.2025 852.5 1116.1775ZM771 1118.7 836.5 1104.6175 836.5 1048.4175 771 1062.5ZM852.5 1101.1775 917.5 1087.2025 917.5 1031.0025 852.5 1044.9775Z\" fill=\"url(#ef-window-mirror-b)\" filter=\"url(#ef-pane-mirror-b)\" opacity=\"0.55\" style=\"opacity:calc(.55 + .45 * var(--ef-darkness,0))\"/>\n      <path d=\"M771 1190 836.5 1175.9175 836.5 1119.6175 771 1133.7ZM852.5 1172.4775 917.5 1158.5025 917.5 1102.2025 852.5 1116.1775ZM771 1118.7 836.5 1104.6175 836.5 1048.4175 771 1062.5ZM852.5 1101.1775 917.5 1087.2025 917.5 1031.0025 852.5 1044.9775Z\" fill=\"url(#ef-window-mirror-c)\" filter=\"url(#ef-pane-mirror-c)\" opacity=\"0.55\" style=\"opacity:calc(.55 + .45 * var(--ef-darkness,0))\"/>\n    </g>\n  </g>\n  <path d=\"M-60 908 290 1036 947 887Q1035 858 1170 888V1408H-60Z\" fill=\"url(#ef-polished-grain)\" mask=\"url(#ef-ground-grain-fade)\" opacity=\".074\"/>\n</g>\n<g class=\"ef-light-only ef-bake\" clip-path=\"url(#ef-floor-plane)\" fill=\"none\" stroke-linejoin=\"round\">\n  <path d=\"M234 1052 290 1072 948 929\" stroke=\"#1a1f30\" stroke-width=\"13\" opacity=\".32\" filter=\"url(#ef-cast-shadow)\"/>\n  <path d=\"M234 1052 290 1072 948 929\" stroke=\"#11131d\" stroke-width=\"4.2\" opacity=\".84\" filter=\"url(#ef-contact-shadow)\"/>\n</g>\n<g class=\"ef-bake\">\n<path d=\"M0 261.605 505 153.03 505 160.03 0 268.605Z\" style=\"fill:var(--ef-roof-edge,#2c2c2e)\"/>\n<path d=\"M0 268.605 505 160.03 672 382.14 75 510.495 63.5 512.5 0 553.5Z\" fill=\"url(#ef-roof-back)\"/>\n<g class=\"ef-light-only\" clip-path=\"url(#ef-back-roof-plane)\"><g transform=\"translate(-145 -125)\" opacity=\".36\">\n  <use href=\"#ef-sun-coating-glint\"/><use href=\"#ef-moon-coating-glint\"/>\n</g></g>\n<g class=\"ef-frost\"><path d=\"M0 268.605 505 160.03 672 382.14 75 510.495 63.5 512.5 0 553.5Z\" fill=\"url(#ef-frost-roof)\" filter=\"url(#ef-frost-ice)\"/></g>\n<path d=\"M0 505 24.54 537.6382 0 553.5Z\" style=\"fill:var(--ef-roof-edge,#2b2b2b)\"/>\n<path d=\"M0 268.605 505 160.03 672 382.14\" fill=\"none\" style=\"stroke:var(--ef-roof-line,#1d1d1f)\" stroke-width=\"1.5\"/>\n<g transform=\"translate(-258 -201.545)\">\n  <use href=\"#ef-pv-cast-shadow\"/>\n  <use id=\"ef-back-pv\" href=\"#ef-pv-array\"/>\n  <g clip-path=\"url(#ef-pv-glass)\"><g transform=\"translate(258 -55.47)\">\n    <use href=\"#ef-sun-shine\" opacity=\".73\"/><use href=\"#ef-moon-shine\"/>\n  </g></g>\n  <use href=\"#ef-pv-weather\"/>\n</g>\n<path d=\"M0 553.5 63.5 512.5 70 513.5 0 568Z\" style=\"fill:var(--ef-roof-edge,#272727)\"/>\n<path d=\"M0 560.2 63.5 516\" fill=\"none\" style=\"stroke:var(--ef-roof-line,#141414)\" stroke-width=\"1.4\"/>\n<path d=\"M0 568 70 513.5 289 806 290 1071 0 968Z\" fill=\"url(#ef-gable)\"/>\n<path class=\"ef-light-only\" d=\"M0 568 70 513.5 289 806 290 1071 0 968Z\" fill=\"url(#ef-stucco-relief)\" opacity=\".13\"/>\n<path d=\"M0 568 70 513.5 289 806 290 1071 0 968Z\" fill=\"url(#ef-gable-shade)\"/>\n<g class=\"ef-frost\"><path d=\"M0 568 70 513.5 289 806 290 1071 0 968Z\" fill=\"url(#ef-frost-gable-foot)\" filter=\"url(#ef-frost-ice)\"/></g>\n<path d=\"M0 701.3 244 788 244 1055 0 968.3Z\" style=\"fill:var(--ef-garage-wall,#191919)\"/>\n<g id=\"ef-garage-door\">\n<polygon points=\"0,714 235,797.5 235,1047.5 0,964\" style=\"fill:var(--ef-door,#2b2b2b)\"/>\n<path id=\"ef-door-slats\" d=\"M0 725.9L235 809.4M0 737.8L235 821.3M0 749.7L235 833.2M0 761.6L235 845.1M0 773.5L235 857M0 785.4L235 868.9M0 797.3L235 880.8M0 809.2L235 892.7M0 821.1L235 904.6M0 833L235 916.5M0 844.9L235 928.4M0 856.8L235 940.3M0 868.7L235 952.2M0 880.6L235 964.1M0 892.5L235 976M0 904.4L235 987.9M0 916.3L235 999.8M0 928.2L235 1011.7M0 940.1L235 1023.6M0 952L235 1035.5\" style=\"stroke:var(--ef-door-line,#1e1e1e);stroke-width:var(--ef-door-seam-width,1.3)\" fill=\"none\"/>\n<g transform=\"matrix(1 .35532 0 1 0 714)\">\n  <rect x=\"0\" y=\"238\" width=\"235\" height=\"6\" fill=\"url(#ef-garage-slat)\"/>\n  <rect x=\"0\" y=\"244\" width=\"235\" height=\"4.5\" fill=\"#595c61\"/>\n  <path d=\"M0 244.4H235\" stroke=\"#9a9da2\" stroke-opacity=\".7\" stroke-width=\".9\"/>\n  <rect x=\"0\" y=\"248.5\" width=\"235\" height=\"1.6\" fill=\"#0d0d0e\"/>\n</g>\n</g>\n<g id=\"ef-garage\" clip-path=\"url(#ef-garage-opening)\">\n  <rect x=\"-5\" y=\"700\" width=\"250\" height=\"360\" fill=\"url(#ef-garage-side)\"/>\n  <rect class=\"ef-light-only\" x=\"-5\" y=\"700\" width=\"250\" height=\"270\" fill=\"url(#ef-garage-wall-down)\"/>\n  <path d=\"M-5 965.2 245 907.2V1060H-5Z\" fill=\"url(#ef-garage-floor)\"/>\n  <rect class=\"ef-light-only\" x=\"-5\" y=\"700\" width=\"250\" height=\"360\" fill=\"url(#ef-garage-vignette)\" opacity=\"0.38\" style=\"opacity:calc(.38 + .22 * var(--ef-darkness,0))\"/>\n  <rect class=\"ef-light-only\" x=\"-5\" y=\"700\" width=\"250\" height=\"160\" fill=\"url(#ef-garage-ceiling)\"/>\n  <ellipse class=\"ef-garage-lamp\" cx=\"95\" cy=\"830\" rx=\"150\" ry=\"115\" fill=\"url(#ef-garage-lamp)\"/>\n  <ellipse class=\"ef-garage-lamp\" cx=\"140\" cy=\"985\" rx=\"125\" ry=\"32\" fill=\"url(#ef-garage-lamp)\" opacity=\".5\"/>\n  <path d=\"M-5 965.2 245 907.2\" stroke=\"#0b0b0c\" stroke-width=\"2\"/>\n  <path d=\"M-5 962.8 245 904.8\" stroke=\"#fff\" stroke-opacity=\".05\" stroke-width=\"1\"/>\n  <g class=\"ef-light-only\">\n    <path d=\"M6 963.5L235 909.5\" fill=\"none\" stroke=\"#2a272a\" stroke-width=\"2.4\" opacity=\".42\"/>\n    <path d=\"M6 961.2L140 929.8\" fill=\"none\" stroke=\"#d8d6dc\" stroke-width=\".9\" opacity=\".26\"/>\n    <g class=\"ef-garage-wash\" fill=\"url(#ef-garage-light)\">\n      <ellipse cx=\"62\" cy=\"792\" rx=\"124\" ry=\"138\"/>\n      <ellipse cx=\"90\" cy=\"984\" rx=\"130\" ry=\"44\" opacity=\".55\"/>\n    </g>\n    <path d=\"M96 700 245 700 245 907.2 96 941.8Z\" fill=\"url(#ef-garage-wall-right)\"/>\n    <path d=\"M0 965 235 910V1050L0 967Z\" fill=\"url(#ef-polished-grain)\" opacity=\".072\"/>\n    <path d=\"M0 964 235 1047.5\" stroke=\"#b9bac1\" stroke-width=\".7\"/>\n  </g>\n  <g id=\"ef-ev-drop\" fill=\"none\" stroke-width=\"13\">\n    <path class=\"ef-drop-pipe\" d=\"M60 815V740\" stroke=\"#4c4c4c\"/>\n    <g transform=\"matrix(1 -.2317 0 1 37 795.5)\">\n      <path d=\"M23.7 44V55C23.7 82 25.5 100 31 110C35.5 117.5 42 121 52 122\" stroke=\"#0e0f11\" stroke-width=\"3.4\" stroke-linecap=\"round\"/>\n      <path d=\"M23 50V56C23 82 24.8 99 30 108.5C33.5 114.5 38 118 44 120\" stroke=\"#4a4d53\" stroke-opacity=\".7\" stroke-width=\".9\"/>\n    </g>\n    <g id=\"ef-f-ev\" class=\"ef-flow\" data-route=\"ef-route-ev\" data-junction-end=\"\" data-flow=\"off\" style=\"--ef-source-color:var(--ef-ev-color,#9b7bea)\">\n     <g stroke-width=\"3.6\" data-junction-shift=\"-50.8\">\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p10\" href=\"#ef-route-ev-cable\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p25\" href=\"#ef-route-ev-cable\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p40\" href=\"#ef-route-ev-cable\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p51\" href=\"#ef-route-ev-cable\"/>\n     </g>\n     <g data-junction-shift=\"-109.75\">\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p10\" href=\"#ef-route-ev-pipe\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p25\" href=\"#ef-route-ev-pipe\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p40\" href=\"#ef-route-ev-pipe\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p51\" href=\"#ef-route-ev-pipe\"/>\n     </g>\n    </g>\n    <g id=\"ef-f-ev2\" class=\"ef-flow\" data-route=\"ef-route-ev\" data-junction-end=\"\" data-flow=\"off\" style=\"--ef-source-color:var(--ef-ev-color,#9b7bea)\">\n     <g stroke-width=\"3.6\" data-junction-shift=\"-50.8\">\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p10\" href=\"#ef-route-ev-cable\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p25\" href=\"#ef-route-ev-cable\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p40\" href=\"#ef-route-ev-cable\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p51\" href=\"#ef-route-ev-cable\"/>\n     </g>\n     <g data-junction-shift=\"-109.75\">\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p10\" href=\"#ef-route-ev-pipe\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p25\" href=\"#ef-route-ev-pipe\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p40\" href=\"#ef-route-ev-pipe\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p51\" href=\"#ef-route-ev-pipe\"/>\n     </g>\n    </g>\n    <g id=\"ef-f-ev3\" class=\"ef-flow\" data-route=\"ef-route-ev\" data-junction-end=\"\" data-flow=\"off\" style=\"--ef-source-color:var(--ef-ev-color,#9b7bea)\">\n     <g stroke-width=\"3.6\" data-junction-shift=\"-50.8\">\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p10\" href=\"#ef-route-ev-cable\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p25\" href=\"#ef-route-ev-cable\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p40\" href=\"#ef-route-ev-cable\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p51\" href=\"#ef-route-ev-cable\"/>\n     </g>\n     <g data-junction-shift=\"-109.75\">\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p10\" href=\"#ef-route-ev-pipe\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p25\" href=\"#ef-route-ev-pipe\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p40\" href=\"#ef-route-ev-pipe\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p51\" href=\"#ef-route-ev-pipe\"/>\n     </g>\n    </g>\n    <g id=\"ef-f-ev4\" class=\"ef-flow\" data-route=\"ef-route-ev\" data-junction-end=\"\" data-flow=\"off\" style=\"--ef-source-color:var(--ef-ev-color,#9b7bea)\">\n     <g stroke-width=\"3.6\" data-junction-shift=\"-50.8\">\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p10\" href=\"#ef-route-ev-cable\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p25\" href=\"#ef-route-ev-cable\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p40\" href=\"#ef-route-ev-cable\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p51\" href=\"#ef-route-ev-cable\"/>\n     </g>\n     <g data-junction-shift=\"-109.75\">\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p10\" href=\"#ef-route-ev-pipe\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p25\" href=\"#ef-route-ev-pipe\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p40\" href=\"#ef-route-ev-pipe\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p51\" href=\"#ef-route-ev-pipe\"/>\n     </g>\n    </g>\n    <path d=\"M60 815V740\" transform=\"translate(-4.4 .9)\" stroke=\"#000\" stroke-opacity=\".3\" stroke-width=\"4.2\"/>\n  </g>\n  <g id=\"ef-ev-charger\" transform=\"matrix(1 -.2317 0 1 45 793.64)\">\n    <rect x=\"1\" y=\"4\" width=\"35\" height=\"51\" rx=\"11\" fill=\"#000\" opacity=\".14\"/>\n    <rect x=\"2.5\" y=\"5.5\" width=\"31\" height=\"47\" rx=\"9\" fill=\"#000\" opacity=\".22\"/>\n    <path d=\"M26.05 1.1 34.75 6.2A8 8 0 0 1 38.7 13.1V43.1A8 8 0 0 1 30.7 51.1H16.7A8 8 0 0 1 12.65 50L3.95 44.9A8 8 0 0 1 0 38V8A8 8 0 0 1 8 0H22A8 8 0 0 1 26.05 1.1Z\" fill=\"url(#ef-ev-body)\"/>\n    <rect x=\"8.7\" y=\"5.1\" width=\"30\" height=\"46\" rx=\"8\" fill=\"url(#ef-ev-face)\"/>\n    <path d=\"M9.4 45V13.1Q9.4 5.8 16.7 5.8H31\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".55\" stroke-width=\".8\"/>\n    <rect x=\"12.7\" y=\"9.6\" width=\"22\" height=\"22\" rx=\"3.2\" fill=\"url(#ef-ev-glass)\"/>\n    <path d=\"M14.2 11H33.2L15 29.6Z\" fill=\"#fff\" opacity=\".07\"/>\n    <path d=\"M25.4 14.1 20.4 21.8H23.9L22.2 28.1 27.4 20H23.9Z\" class=\"ef-ev-led\"/>\n    <rect x=\"13.7\" y=\"36.6\" width=\"20\" height=\"5\" rx=\"2.5\" class=\"ef-ev-led\" opacity=\".28\"/>\n    <rect x=\"15.2\" y=\"38\" width=\"17\" height=\"2.2\" rx=\"1.1\" class=\"ef-ev-led\"/>\n    <g class=\"ef-light-only\">\n      <rect x=\"8.7\" y=\"5.1\" width=\"30\" height=\"46\" rx=\"7.5\" fill=\"url(#ef-ev-face)\"/>\n      <path d=\"M9.4 45V12.6Q9.4 5.8 16.2 5.8H31.5\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".75\" stroke-width=\".95\"/>\n      <rect x=\"13\" y=\"9.5\" width=\"21.4\" height=\"23.4\" rx=\"3.2\" fill=\"#14161b\"/>\n      <path d=\"M14.2 10.7H33.2L14.8 30.8Z\" fill=\"#fff\" opacity=\".07\"/>\n      <path d=\"M25.2 13.8 20.6 21.3H23.7L22.4 28.4 27.1 20.3H24Z\" fill=\"#4ce868\" filter=\"drop-shadow(0 0 .8px rgb(76 232 104/.55))\"/>\n      <rect x=\"15.2\" y=\"39.4\" width=\"17\" height=\"2.6\" rx=\"1.3\" fill=\"#78ec8b\" opacity=\".20\"/>\n      <rect x=\"16.6\" y=\"40.1\" width=\"14.2\" height=\"1.3\" rx=\".65\" fill=\"#a2f4ae\" opacity=\".52\"/>\n    </g>\n  </g>\n  <g id=\"ef-car\" transform=\"matrix(1 .3649 0 1.027 33 961.2)\">\n    <g>\n      <ellipse cx=\"128\" cy=\"-35\" rx=\"84\" ry=\"11\" transform=\"rotate(-11 128 -35)\" fill=\"url(#ef-tyre-shadow)\" opacity=\".58\"/>\n      <path d=\"M36 -45 45 -40.5 60 -36 80 -32 100 -32.5 120 -34.5 140 -37 160 -42.5 180 -53.5 200 -70 215 -83.5 L215 -49 200 -36 180 -21 160 -12 140 -9 120 -11 100 -14 80 -18 60 -24 45 -30 36 -34Z\" fill=\"url(#ef-car-shade)\" filter=\"url(#ef-car-shade-blur)\"/>\n      <path d=\"M34 -38 L60 -31 L100 -27.5 L140 -32 L180 -48.5 L206 -70 L206 -26 L190 10 L150 40 L96 52 L50 44 L26 20Z\" fill=\"url(#ef-car-floor-fall)\" filter=\"url(#ef-car-fall-blur)\"/>\n      <path d=\"M40 -37.5 L45 -35 L50 -33.5 L55 -32 L60 -30.5 L65 -29 L70 -28 L75 -27 L80 -26.5 L85 -26.5 L90 -26.5 L95 -26.5 L100 -27 L105 -27.5 L110 -28 L115 -28.5 L120 -29 L125 -29.5 L130 -30 L135 -31 L140 -31.5 L145 -32.5 L150 -34 L155 -35.5 L160 -37 L165 -39 L170 -41.5 L175 -44.5 L180 -48 L185 -52 L190 -56 L195 -60 L200 -64.5 L205 -69\" fill=\"none\" stroke=\"#0d0d10\" stroke-opacity=\".86\" stroke-width=\"6.2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" filter=\"url(#ef-car-touch)\"/>\n      <path d=\"M44 -41C44 -34 48 -31 55 -31L66 -31C64 -35 62 -39 60 -42Z\" fill=\"#0f1013\"/>\n    </g>\n    <path id=\"ef-painted-bumper\" d=\"M50 -110.5c-.2 1.6-.1 3.4-.7 4.9c-.8 1.9-2.5 3.5-3.6 5.3c-1.1 1.8-2.3 3.5-3 5.4c-.9 2.5-1.3 5.2-1.7 7.9c-.5 3.4-.8 6.9-1.2 10.4c-.4 2.9-.6 5.9-1.1 8.8c-.4 2.1-1 4.1-1.5 6.2c-.4 1.8-.8 3.5-1 5.3c-.2 1.1-.1 2.3-.2 3.4l15.3 10.6l55.4 .3l29.6 .1c2.3-.8 4.7-1.5 7-2.3c2.5-.8 4.9-1.8 7.4-2.6c6.4-2.2 12.9-4.1 19.3-6.5c4.3-1.6 8.7-3.3 12.7-5.5c2.7-1.5 5.1-3.5 7.3-5.5c2-1.8 3.6-3.9 5.3-5.9c1.9-2.3 3.6-4.8 5.4-7.2l0-58l-44 2.3l-53.4 5.6l-33.3 2.5Z\" fill=\"url(#ef-bumper-left)\"/>\n    <g clip-path=\"url(#ef-painted-bumper-clip)\"><rect x=\"0\" y=\"-245\" width=\"320\" height=\"280\" fill=\"url(#ef-bumper-right)\" mask=\"url(#ef-coat-right)\"/></g>\n    <g clip-path=\"url(#ef-painted-bumper-clip)\" fill=\"url(#ef-clearcoat-roll)\">\n      <ellipse cx=\"0\" cy=\"0\" rx=\"41\" ry=\"8\" transform=\"matrix(1 -.27 0 1 136 -97)\" opacity=\".76\"/>\n      <ellipse cx=\"0\" cy=\"0\" rx=\"31\" ry=\"8\" transform=\"matrix(1 -.37 0 1 173 -58)\" opacity=\".31\"/>\n      <ellipse cx=\"0\" cy=\"0\" rx=\"65\" ry=\"9\" transform=\"matrix(1 -.07 0 1 95 -65)\" opacity=\".41\"/>\n    </g>\n            <path id=\"ef-painted-hatch\" d=\"M135 -103.4c-1.2 1.5-2.5 3-3.7 4.6c-1.4 1.8-2.8 3.7-4 5.6c-1.2 1.8-2.4 3.7-3.3 5.7c-.9 1.9-1.6 3.8-2.2 5.8c-.5 1.5-.7 3.1-1.1 4.7c-.3 1-.4 2.1-.9 3c-.4 .8-.9 1.6-1.6 2.1c-.7 .5-1.6 .7-2.5 .9c-1.9 .5-3.8 .9-5.7 1.1c-3.3 .4-6.7 .7-10 .9c-3.3 .2-6.7 .1-10 .1c-3.3 0-6.7 0-10 0c-3.3 0-6.7 0-10-.1c-3.3-.1-6.7-.1-10-.3c-2.2-.2-4.5-.5-6.7-.9c-1.4-.3-2.8-.5-4-1.1c-.8-.4-1.6-1.1-2.1-1.9c-.6-1-.8-2.2-1-3.3c-.4-2.1-.6-4.3-.7-6.4c-.1-2.2-.2-4.5 0-6.7c.2-1.9 .4-3.9 1-5.7c.5-1.7 1.5-3.2 2.2-4.8l1.4-6.2c4.5 1.5 8.9 3.6 13.5 4.4c6.1 1.1 12.4 1.5 18.6 1.5c7.9 0 15.9-.6 23.8-1.5c9.6-1.1 19.1-3 28.7-4.5Z\" fill=\"url(#ef-hatch-left)\" stroke=\"#1d2023\" stroke-opacity=\".7\" stroke-width=\".5\"/>\n    <g clip-path=\"url(#ef-painted-hatch-clip)\"><rect x=\"0\" y=\"-245\" width=\"320\" height=\"280\" fill=\"url(#ef-hatch-right)\" mask=\"url(#ef-coat-right)\"/></g>\n    <g clip-path=\"url(#ef-painted-hatch-clip)\" fill=\"none\">\n      <path d=\"M135 -103.4c-1.2 1.5-2.5 3-3.7 4.6c-1.4 1.8-2.8 3.7-4 5.6c-1.2 1.8-2.4 3.7-3.3 5.7c-.9 1.9-1.6 3.8-2.2 5.8c-.5 1.5-.7 3.1-1.1 4.7c-.3 1-.4 2.1-.9 3c-.4 .8-.9 1.6-1.6 2.1c-.7 .5-1.6 .7-2.5 .9c-1.9 .5-3.8 .9-5.7 1.1c-3.3 .4-6.7 .7-10 .9c-3.3 .2-6.7 .1-10 .1c-3.3 0-6.7 0-10 0c-3.3 0-6.7 0-10-.1c-3.3-.1-6.7-.1-10-.3c-2.2-.2-4.5-.5-6.7-.9c-1.4-.3-2.8-.5-4-1.1c-.8-.4-1.6-1.1-2.1-1.9c-.6-1-.8-2.2-1-3.3c-.4-2.1-.6-4.3-.7-6.4c-.1-2.2-.2-4.5 0-6.7c.2-1.9 .4-3.9 1-5.7c.5-1.7 1.5-3.2 2.2-4.8l1.4-6.2c4.5 1.5 8.9 3.6 13.5 4.4c6.1 1.1 12.4 1.5 18.6 1.5c7.9 0 15.9-.6 23.8-1.5c9.6-1.1 19.1-3 28.7-4.5Z\" fill=\"none\" stroke=\"#343340\" stroke-width=\"1.35\" opacity=\".76\"/>\n      <path d=\"M43 -98C64 -86 98 -86 124 -94\" stroke=\"#e0e3ee\" stroke-width=\"2.5\" opacity=\".27\" filter=\"url(#ef-rim-shadow)\"/>\n    </g>\n        <path d=\"M145 -105.1c3.3-.7 6.7-1.3 10-2.2c3.4-.9 6.7-1.9 10-3.1c3.1-1.1 6.1-2.3 9-3.7c2.3-1 4.6-2.1 6.7-3.5c1.1-.8 2-1.9 3-2.9c-.5 2.4-.2 5.3-1.4 7.3c-2 3.3-5 6.5-8.3 8.6c-5.2 3.4-11.3 5.8-17.3 7.8c-5.9 2-12.2 3.4-18.4 4.2c-3.6 .4-7.3-.4-11-.6c1.3-1.9 2.6-3.8 4-5.6c1.2-1.6 2.5-3.1 3.7-4.6Z\" fill=\"url(#ef-car-glow)\"/>\n    <path d=\"M36.3 -43.7c5 1.9 9.9 4.2 15 5.7c6.1 1.8 12.4 3 18.7 4c6.6 1 13.3 1.6 20 1.9c5.6 .3 11.2 .6 16.7-.2c5.1-.7 10-2.8 15-4.4c4.9-1.6 9.7-3.5 14.6-5.2c2.3-.8 4.7-1.5 7-2.3c2.5-.8 4.9-1.8 7.4-2.6c6.4-2.2 12.9-4.1 19.3-6.5c4.3-1.6 8.7-3.3 12.7-5.5c2.7-1.5 5.1-3.5 7.3-5.5c2-1.8 3.6-3.9 5.3-5.9c1.9-2.3 3.6-4.8 5.4-7.2L200.0 -65.8C198.0 -64.1 192.2 -58.9 188.0 -55.5C183.8 -52.2 179.7 -48.7 175.0 -45.8C170.3 -43.0 165.3 -40.4 160.0 -38.3C154.7 -36.2 148.8 -34.6 143.0 -33.4C137.2 -32.1 131.3 -31.6 125.0 -30.8C118.7 -30.0 111.2 -29.2 105.0 -28.7C98.8 -28.1 93.8 -27.5 88.0 -27.6C82.2 -27.7 75.8 -28.2 70.0 -29.2C64.2 -30.3 57.6 -32.7 53.0 -34.0C48.4 -35.4 45.1 -36.3 42.5 -37.4C39.9 -38.5 38.6 -39.5 37.6 -40.5C36.6 -41.6 36.5 -43.2 36.3 -43.7Z\" fill=\"url(#ef-car-lip)\"/>\n    <path d=\"M90 -28.4c12.2-1.6 24.5-2.7 36.7-4.7c10.1-1.6 20.3-3.2 30-6.2c7.6-2.4 14.7-6.7 22-10\" fill=\"none\" stroke=\"#7b8084\" stroke-opacity=\".4\" stroke-width=\".5\" stroke-linecap=\"round\"/>\n    <path d=\"M36 -54.2c.8 .1 1.7 .2 2.5 .3c2.9 .3 5.7 .7 8.6 1c3.1 .3 6.1 .5 9.2 .6c3.3 .2 6.5 .3 9.8 .3c3.4 .1 6.9 0 10.3 0c3.6-.1 7.3-.2 10.9-.3c3.8-.2 7.6-.3 11.4-.6c4-.3 8-1.1 12-1c3.8 .1 7.6 .9 11.3 1.5c1.5 .2 2.9 .6 4.3 1.1c1.4 .5 2.8 1.1 4 1.9c1.1 .7 2.1 1.7 3 2.6c.8 .8 1.4 1.7 2 2.6c.4 .7 .7 1.5 1 2.3c-4.9 1.7-9.7 3.6-14.6 5.2c-5 1.6-9.9 3.7-15 4.4c-5.5 .8-11.1 .5-16.7 .2c-6.7-.3-13.4-.9-20-1.9c-6.3-1-12.6-2.2-18.7-4c-5.1-1.5-10-3.8-15-5.7Z\" fill=\"url(#ef-car-recess)\"/>\n    <path d=\"M36.5 -49.9H129M36.6 -47.9H131.8M36.6 -45.9H133.7M36.7 -43.9H135.1M41.2 -41.9H135.9M46.2 -39.9H130.4M52.2 -37.9H124.8M60.3 -35.9H118.8\" fill=\"none\" stroke=\"#7d8286\" stroke-opacity=\".6\" stroke-width=\".4\"/>\n    <path d=\"M36 -53.3c.8 .1 1.7 .1 2.5 .2c2.9 .3 5.7 .7 8.6 1c3.1 .3 6.1 .5 9.2 .7c3.3 .2 6.5 .3 9.8 .3c3.4 .1 6.9 .1 10.3 0c3.6-.1 7.3-.2 10.9-.4c3.8-.2 7.6-.3 11.4-.6c4-.3 8-1.1 12-1c3.8 .1 7.6 .9 11.3 1.5c1.5 .2 2.9 .6 4.3 1.1c1.4 .5 2.8 1.1 4 1.9c1.1 .7 2 1.7 3 2.6\" fill=\"none\" stroke=\"#000\" stroke-opacity=\".55\" stroke-width=\"1\" stroke-linecap=\"round\"/>\n    <path d=\"M37.1 -61.9c.3 0 .6 .1 .9 .1c2.9 .4 5.8 .8 8.7 1.1c3.1 .3 6.2 .5 9.3 .7c3.3 .2 6.5 .3 9.8 .3c3.5 .1 7 0 10.5 0c3.7-.1 7.4-.1 11.1-.3c3.9-.2 7.8-.4 11.7-.7c4.1-.3 8.2-1 12.3-1.1c5.1-.2 10.2-.1 15.3 .2c2 .1 4 .4 6 .9c1.4 .3 2.8 .8 4 1.5c1.3 .7 2.5 1.7 3.6 2.6c1.4 1.2 2.7 2.5 4 3.7c1.1 1.1 2.3 2.1 3.4 3.2c1 1 2 1.9 3 2.9l-14.4 4.9c-.3-.8-.6-1.6-1-2.3c-.6-.9-1.2-1.8-2-2.6c-.9-.9-1.9-1.9-3-2.6c-1.2-.8-2.6-1.4-4-1.9c-1.4-.5-2.8-.9-4.3-1.1c-3.7-.6-7.5-1.4-11.3-1.5c-4-.1-8 .7-12 1c-3.8 .3-7.6 .4-11.4 .6c-3.6 .1-7.3 .2-10.9 .3c-3.4 0-6.9 .1-10.3 0c-3.3 0-6.5-.1-9.8-.3c-3.1-.1-6.1-.3-9.2-.6c-2.9-.3-5.7-.7-8.6-1c-.8-.1-1.7-.2-2.5-.3l.2-2.1l1-5.3Z\" fill=\"url(#ef-diffuser-blade)\"/>\n    <path d=\"M37.1 -61.9c.3 0 .6 .1 .9 .1c2.9 .4 5.8 .8 8.7 1.1c3.1 .3 6.2 .5 9.3 .7c3.3 .2 6.5 .3 9.8 .3c3.5 .1 7 0 10.5 0c3.7-.1 7.4-.1 11.1-.3c3.9-.2 7.8-.4 11.7-.7c4.1-.3 8.2-1 12.3-1.1c5.1-.2 10.2-.1 15.3 .2c2 .1 4 .4 6 .9c1.4 .3 2.8 .8 4 1.5c1.3 .7 2.5 1.7 3.6 2.6c1.4 1.2 2.7 2.5 4 3.7c1.1 1.1 2.3 2.1 3.4 3.2c1 1 2 1.9 3 2.9\" fill=\"none\" stroke=\"#16181a\" stroke-opacity=\".8\" stroke-width=\".6\" stroke-linecap=\"round\"/>\n    <path d=\"M37.1 -62.6c.3 0 .6 .1 .9 .1c2.9 .4 5.8 .8 8.7 1.1c3.1 .3 6.2 .5 9.3 .7c3.3 .2 6.5 .3 9.8 .3c3.5 .1 7 0 10.5 0c3.7-.1 7.4-.1 11.1-.3c3.9-.2 7.8-.4 11.7-.7c4.1-.3 8.2-1 12.3-1.1c5.1-.2 10.2 .1 15.3 .2\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".6\" stroke-width=\".55\" stroke-linecap=\"round\"/>\n    <path d=\"M36 -54.7c.8 .1 1.7 .2 2.5 .3c2.9 .3 5.7 .7 8.6 1c3.1 .3 6.1 .5 9.2 .6c3.3 .2 6.5 .3 9.8 .3c3.4 .1 6.9 0 10.3 0c3.6-.1 7.3-.2 10.9-.3c3.8-.2 7.6-.3 11.4-.6c4-.3 8-1.1 12-1c3.8 .1 7.6 .9 11.3 1.5c1.5 .2 2.9 .6 4.3 1.1c1.4 .5 2.8 1.1 4 1.9c1.1 .7 2.1 1.7 3 2.6c.8 .8 1.4 1.7 2 2.6c.4 .7 .7 1.5 1 2.3\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".5\" stroke-width=\".55\" stroke-linecap=\"round\"/>\n    <path d=\"M143.3 -44.7c2.5-.9 4.9-1.7 7.4-2.6c6.4-2.2 12.9-4.2 19.3-6.6c4.3-1.6 8.7-3.3 12.7-5.5c2.6-1.4 4.9-3.6 7.3-5.4\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".14\" stroke-width=\".6\" stroke-linecap=\"round\"/>\n    <path d=\"M38.5 -51.7c.5-.2 1-.4 1.5-.5c.5-.1 .9-.1 1.4-.1c.5 0 .9 .1 1.4 .1c.5 0 1 0 1.5 .1c.5 .1 1 .1 1.4 .3c.5 .3 .9 .7 1.4 1.1c-.5 .2-.9 .6-1.4 .7c-.4 .1-.9 0-1.4 0c-.5 0-1 0-1.5-.1c-.5-.1-.9-.2-1.4-.3c-.5-.1-1-.2-1.4-.4c-.5-.2-1-.6-1.5-.9Z\" fill=\"#c2141d\"/>\n    <path d=\"M40 -51.8c.5 0 .9 .1 1.4 .1c.5 0 .9 .1 1.4 .1c.5 0 1 0 1.5 .1c.5 .1 .9 .2 1.4 .3\" fill=\"none\" stroke=\"#ff7c84\" stroke-opacity=\".7\" stroke-width=\".4\" stroke-linecap=\"round\"/>\n    <path d=\"M98.3 -50.7c.7-.4 1.3-.9 2-1.1c.7-.2 1.4-.2 2.1-.3c.7-.1 1.3-.2 2-.2c.7 0 1.3 0 2 0c.7 0 1.3-.1 2 0c.7 .1 1.3 .4 2 .6c-.7 .3-1.3 .7-2 .9c-.6 .2-1.3 .3-2 .4c-.7 .1-1.3 .1-2 .2c-.7 .1-1.3 .2-2 .2c-.7 0-1.4 .1-2.1 0c-.7-.1-1.3-.5-2-.7Z\" fill=\"#c2141d\"/>\n    <path d=\"M100.3 -51.2c.7-.1 1.4-.2 2.1-.3c.7-.1 1.3-.1 2-.1c.7-.1 1.3-.2 2-.2c.7 0 1.3 0 2 0\" fill=\"none\" stroke=\"#ff7c84\" stroke-opacity=\".7\" stroke-width=\".4\" stroke-linecap=\"round\"/>\n    <path d=\"M51.9 -51.1l39.1 0l-.5 14l-37.5 0Z\" fill=\"#23252a\"/>\n    <path d=\"M52.4 -50.3l37.6 0l-.4 12.7l-36.2 0Z\" fill=\"url(#ef-car-plate)\"/>\n    <g>\n      <path d=\"M49 -51.6 93.5 -51.6 90.8 -36.4 51.4 -36.4Z\" fill=\"#121318\"/>\n      <path d=\"M52.8 -50 89.2 -50 88.6 -37.8 53.6 -37.8Z\" fill=\"url(#ef-car-plate)\"/>\n      <path d=\"M52.8 -50 89.2 -50 89.1 -48.2 52.9 -48.2Z\" fill=\"#0d0e11\" opacity=\".34\"/>\n      <path d=\"M37.5 -61.8C60 -59 95 -59 125 -60.5C136 -59 144 -54 150 -48\" fill=\"none\" stroke=\"#dce0ec\" stroke-opacity=\".42\" stroke-width=\".95\"/>\n    </g>\n    <path id=\"ef-painted-deck\" d=\"M49.4 -110.2c2.1 .9 4.1 2 6.2 2.7c2.4 .8 5 1.4 7.5 1.9c2.9 .6 5.9 1 8.8 1.2c3.4 .3 6.8 .4 10.2 .4c3.8 0 7.7-.1 11.5-.4c4.2-.3 8.5-.7 12.7-1.2c4.7-.5 9.4-1.2 14.1-1.9c5.2-.8 10.4-1.7 15.5-2.7c5.3-1 10.5-2.3 15.8-3.5c5.5-1.2 11.1-2.4 16.6-3.7c5.1-1.2 10.3-2.4 15.4-3.6c1.5-.8 3-1.7 4.6-2.5c1.9-.9 3.8-1.7 5.7-2.5c2.2-.9 4.5-1.7 6.7-2.6l18.1-19.8l41.8-29.5l93.1-110.1l-86.6 0l-38.9 23.1l-78 61.7c-3.7 3-7.5 5.9-11.1 9c-3.3 2.9-6.4 6-9.5 9.1c-3.2 3.2-6.4 6.4-9.5 9.6c-2.6 2.6-5.2 5.1-7.6 7.9c-3.4 3.9-6.2 8.5-9.8 12.2c-2.2 2.2-5.1 3.7-7.7 5.5c-2.8 2-5.5 4-8.3 6c-2.8 2-5.6 4-8.4 6c-2.8 2-5.6 4-8.3 6.1c-2 1.5-4 3-6 4.6c-1.8 1.4-3.6 2.8-5.3 4.3c-1.4 1.2-2.8 2.4-4 3.7c-1.1 1.3-2.2 2.6-3 4.1c-.8 1.4-1.1 3.1-1.7 4.6Z\" fill=\"url(#ef-deck-left)\"/>\n    <g clip-path=\"url(#ef-painted-deck-clip)\"><rect x=\"0\" y=\"-245\" width=\"320\" height=\"280\" fill=\"url(#ef-deck-right)\" mask=\"url(#ef-coat-right)\"/></g>\n    <path id=\"ef-painted-quarter\" d=\"M136.5 -108.9c.6-1 1.1-2.1 1.8-3c.9-1.1 1.9-2.1 3-3.1c1.4-1.3 2.9-2.5 4.4-3.7c1.7-1.4 3.5-2.8 5.3-4.2c1.9-1.5 3.8-3 5.7-4.5c1.9-1.5 3.9-2.8 5.6-4.4c1.5-1.4 2.9-2.9 4-4.6c.9-1.4 1.7-3 2.2-4.6c.5-1.4 .5-2.9 .8-4.3l-2.7 9.7c3.7-4.2 7.4-8.5 11.1-12.7c4.1-4.7 8.2-9.3 12.4-13.9c4.5-4.9 9-9.7 13.5-14.6l-2.9 21.4l0 26.8c-2.2 .9-4.5 1.7-6.7 2.6c-1.9 .8-3.8 1.6-5.7 2.5c-1.6 .8-3.1 1.7-4.6 2.5c-5.1 1.2-10.3 2.4-15.4 3.6c-5.5 1.3-11.1 2.5-16.6 3.7c-5.3 1.2-10.5 2.3-15.8 3.5Z\" fill=\"url(#ef-quarter-left)\"/>\n    <g clip-path=\"url(#ef-quarter-clip)\"><rect x=\"0\" y=\"-245\" width=\"320\" height=\"280\" fill=\"url(#ef-quarter-right)\" mask=\"url(#ef-coat-right)\"/></g>\n    <path d=\"M183.7 -120.8c1.5-.8 3-1.7 4.6-2.5c1.9-.9 3.8-1.7 5.7-2.5c2.2-.9 4.5-1.7 6.7-2.6\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".5\" stroke-width=\".6\" stroke-linecap=\"round\"/>\n    <path d=\"M50.7 -110.8c1-1.3 1.9-2.7 3-3.9c1.6-1.7 3.3-3.2 5-4.7c1.7-1.5 3.5-2.9 5.3-4.3c1.3-1 2.6-1.9 4-2.7c.7-.4 1.5-1 2.2-1.1c.4-.1 1 .2 1.3 .5c.7 .6 1 1.6 1.7 2.2c.9 .7 2 1.3 3.1 1.7c1.7 .5 3.6 .7 5.4 1c2.8 .4 5.5 .8 8.3 .9c4.4 .2 8.9 .4 13.3 .2c5.6-.3 11.1-1.1 16.7-1.7c5.6-.6 11.1-1.3 16.7-2c3.9-.5 7.7-1.1 11.6-1.6c2.8-.4 5.6-.7 8.4-1.1c-1.9 1.5-3.8 3-5.7 4.5c-1.8 1.4-3.6 2.8-5.3 4.2c-1.5 1.2-3 2.4-4.4 3.7c-1.1 1-2.1 2-3 3.1c-.7 .9-1.2 2-1.8 3\" fill=\"none\" stroke=\"#16181a\" stroke-opacity=\".5\" stroke-width=\".55\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/>\n    <path d=\"M156.7 -127.4c1.9-1.5 3.9-2.8 5.6-4.4c1.5-1.4 2.9-2.9 4-4.6c.9-1.4 1.7-3 2.2-4.6c.5-1.4 .5-2.9 .8-4.3\" fill=\"none\" stroke=\"#16181a\" stroke-opacity=\".5\" stroke-width=\".55\" stroke-linecap=\"round\"/>\n    <path d=\"M76.1 -122.3c1.8 .3 3.6 .7 5.4 1c2.8 .4 5.5 .8 8.3 .9c4.4 .2 8.9 .4 13.3 .2c5.6-.3 11.1-1.1 16.7-1.7c5.6-.6 11.1-1.3 16.7-2c3.9-.5 7.7-1.1 11.6-1.6c2.8-.4 5.6-.7 8.4-1.1\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".45\" stroke-width=\".55\" stroke-linecap=\"round\"/>\n    <path id=\"ef-back-windscreen\" d=\"M194.5 -168.7c6.2-6.6 12.5-13 18.6-19.6c1.3-1.4 2.6-2.9 3.7-4.5c.6-.8 1.1-1.9 1.2-2.8c.1-.6-.2-1.5-.6-1.9c-.6-.6-1.5-1-2.4-1.2c-1.6-.4-3.4-.6-5.1-.7c-7.9-.2-15.8-.2-23.7-.2c-8.1 0-16.2 0-24.3 .2c-2.3 .1-4.6 .3-6.9 .7c-1.8 .3-3.6 .7-5.4 1.2c-1.6 .5-3.3 1.1-4.8 1.9c-1.7 .8-3.3 1.8-4.8 2.8c-2 1.4-4 2.8-5.8 4.5c-6.7 6.4-13.3 12.9-19.7 19.6c-6.6 6.8-13 13.8-19.3 20.9c-1.6 1.8-3 3.8-4.5 5.7c-.9 1.3-1.9 2.5-2.7 3.9c-.6 1-1 2.1-1.3 3.2c-.2 .8-.4 1.8-.1 2.5c.3 .9 1 2.1 1.9 2.3c5.8 1.4 12.1 2.5 18.2 2.5c10.2 0 20.5-1.3 30.7-2.5c3.5-.4 6.9-1.4 10.3-2.3c2.7-.7 5.3-1.5 7.9-2.5c2.3-.9 4.5-2 6.7-3.2c2.1-1.2 4.3-2.4 6.2-3.9c2.3-1.7 4.5-3.6 6.5-5.7c6.7-6.8 13-14 19.5-20.9Z\" fill=\"url(#ef-glass-left)\" stroke=\"#dfe4e6\" stroke-opacity=\".5\" stroke-width=\"2.2\" paint-order=\"stroke\"/>\n    <g clip-path=\"url(#ef-back-windscreen-clip)\"><rect x=\"0\" y=\"-245\" width=\"320\" height=\"280\" fill=\"url(#ef-glass-right)\" mask=\"url(#ef-coat-right)\"/></g>\n    <g clip-path=\"url(#ef-back-windscreen-clip)\">\n      <path class=\"ef-car-hi-a\" d=\"M84 -146C108 -176 150 -203 182 -204\" fill=\"none\" stroke=\"#dce1ec\" stroke-opacity=\".56\" stroke-width=\"2.1\" filter=\"url(#ef-optical-blur)\"/>\n      <path class=\"ef-car-hi-b\" d=\"M81 -139C106 -169 148 -199 188 -201\" fill=\"none\" stroke=\"#b6bcc8\" stroke-opacity=\".22\" stroke-width=\"5.5\" filter=\"url(#ef-rim-shadow)\"/>\n    </g>\n        <path d=\"M89.5 -140.4l6.2 3l102.3-57.5l-14.2 .1Z\" fill=\"#fff\" opacity=\".06\"/>\n    <path d=\"M55.6 -107.5c2.5 .6 5 1.4 7.5 1.9c2.9 .6 5.9 1 8.8 1.2c3.4 .3 6.8 .4 10.2 .4c3.8 0 7.7-.1 11.5-.4c4.2-.3 8.5-.7 12.7-1.2c4.7-.5 9.4-1.2 14.1-1.9c5.2-.8 10.4-1.7 15.5-2.7c5.3-1 10.5-2.3 15.8-3.5c5.5-1.2 11.1-2.4 16.6-3.7c5.1-1.2 10.3-2.4 15.4-3.6\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".75\" stroke-width=\".8\" stroke-linecap=\"round\"/>\n    <path d=\"M136.1 -109.5c-4.5 .8-9 1.7-13.5 2.4c-4.2 .7-8.5 1.3-12.7 1.8c-3.9 .5-7.7 1-11.6 1.3c-3.5 .3-7.1 .5-10.6 .6c-3.2 .1-6.3 .1-9.5 0c-2.8-.1-5.7-.3-8.5-.6c-2.5-.3-5-.7-7.5-1.2c-2.2-.5-4.3-1.1-6.4-1.9c-1.8-.7-3.6-1.6-5.4-2.4l-.5 2.6l-.6-.3l.5 4.9c1.8 .8 3.5 1.9 5.4 2.3c2.1 .4 4.4 .1 6.6 .2c2.5 .1 4.9 .3 7.4 .4c2.8 .2 5.6 .4 8.4 .5c3.1 .1 6.2 .1 9.3 0c3.4-.1 6.8-.3 10.2-.6c3.8-.3 7.5-.7 11.3-1.2c4.1-.5 8.1-1.1 12.2-1.7c4.4-.7 8.7-1.8 13.1-2.3c3.7-.4 7.6 .1 11.3-.4c3.4-.4 6.7-1.3 10-2.2c3.4-.9 6.7-1.9 10-3.1c3.1-1.1 6.1-2.3 9-3.7c2.3-1 4.6-2.1 6.7-3.5c1.1-.8 2-1.9 3-2.9l-47.6 11c5.2-1.2 10.4-2.3 15.6-3.5c5.5-1.3 11.1-2.6 16.6-3.9c4.8-1.1 9.6-2.2 14.4-3.3c.3-.1 .7-.2 1-.3Z\" fill=\"#0e0f11\"/>\n    <path d=\"M50.2 -104.8c1.8 .8 3.5 1.9 5.4 2.3c2.1 .5 4.4 .2 6.6 .3c2.5 .1 5.1 .2 7.6 .4c2.8 .2 5.6 .5 8.4 .6c3.1 .1 6.3 0 9.4-.1c3.5-.1 6.9-.3 10.4-.6c3.8-.3 7.7-.7 11.5-1.2c4.1-.5 8.3-1.1 12.4-1.8c4.4-.7 8.8-2 13.3-2.4c3.2-.3 6.6 .5 9.8 .2c3.4-.3 6.7-1.3 10-2.2c3.4-.9 6.7-1.9 10-3.1c3.1-1.1 6.1-2.3 9-3.7c2.3-1 4.5-2.3 6.7-3.5l0 2c-2.2 1.2-4.4 2.5-6.7 3.5c-2.9 1.4-5.9 2.6-9 3.7c-3.3 1.2-6.6 2.2-10 3.1c-3.3 .9-6.6 1.8-10 2.2c-3.7 .5-7.6 0-11.3 .4c-4.4 .5-8.7 1.6-13.1 2.3c-4.1 .6-8.1 1.2-12.2 1.7c-3.8 .5-7.5 .9-11.3 1.2c-3.4 .3-6.8 .5-10.2 .6c-3.1 .1-6.2 .1-9.3 0c-2.8-.1-5.6-.3-8.4-.5c-2.5-.1-4.9-.3-7.4-.4c-2.2-.1-4.5 .2-6.6-.2c-1.9-.4-3.6-1.5-5.4-2.3l-.5-4.9Z\" fill=\"#2b2e32\"/>\n    <path d=\"M49.8 -103.5c1.8 .8 3.4 1.9 5.3 2.3c2.1 .5 4.4 .2 6.6 .3c2.5 .1 5 .2 7.5 .4c2.8 .2 5.6 .5 8.4 .6c3.1 .1 6.3 .1 9.4 0c3.5-.1 6.9-.4 10.4-.7c3.8-.3 7.6-.6 11.4-1.1c4.1-.5 8.2-1.1 12.3-1.8c4.4-.7 8.8-1.9 13.3-2.4c3.5-.4 7.1 .3 10.6-.1c3.4-.4 6.7-1.3 10-2.2c3.4-.9 6.7-1.9 10-3.1c3.1-1.1 6-2.5 9-3.7\" fill=\"none\" stroke=\"#a9b0b4\" stroke-opacity=\".5\" stroke-width=\".55\" stroke-linecap=\"round\"/>\n    <path d=\"M50.3 -109.1c1.8 .8 3.5 1.8 5.3 2.4c2.1 .8 4.3 1.3 6.5 1.8c2.4 .5 4.9 .9 7.4 1.2c2.8 .3 5.7 .5 8.5 .6c3.2 .1 6.4 .1 9.6 0c3.5-.1 7.1-.3 10.6-.6c3.9-.3 7.7-.7 11.6-1.2c4.2-.5 8.5-1.1 12.7-1.8c4.5-.7 9-1.5 13.5-2.4c5.3-1.1 10.5-2.3 15.7-3.5c5.5-1.3 11.1-2.6 16.6-3.9c4.8-1.1 9.6-2.2 14.4-3.3\" fill=\"none\" stroke=\"#d3262f\" stroke-opacity=\"1\" stroke-width=\"1\" stroke-linecap=\"round\"/>\n    <path d=\"M53 -108.2c4.5 1.7 9.8 2.8 15.5 3.4c8.5 .9 17.5 .5 26.8-.3c12.2-1.1 24.8-3.1 37.8-5.6c12.8-2.5 25.5-5.4 37.5-8.2\" fill=\"none\" stroke=\"#ffe4da\" stroke-opacity=\".86\" stroke-width=\".4\" stroke-linecap=\"round\"/>\n    <path d=\"M50.3 -109.5c1.8 .8 3.5 1.8 5.3 2.4c2.1 .8 4.3 1.3 6.5 1.8c2.4 .5 4.9 1 7.4 1.3c2.8 .3 5.7 .5 8.5 .6c3.2 .1 6.4 .1 9.6 0c3.5-.1 7.1-.3 10.6-.6c3.9-.3 7.7-.8 11.6-1.3c4.2-.5 8.5-1.1 12.7-1.8c4.5-.7 9-1.5 13.5-2.4c5.3-1.1 10.5-2.3 15.7-3.5c5.5-1.3 11.1-2.6 16.6-3.9c4.8-1.1 9.6-2.2 14.4-3.3\" fill=\"none\" stroke=\"#ff9096\" stroke-opacity=\".5\" stroke-width=\".35\" stroke-linecap=\"round\"/>\n    <path d=\"M168.7 -116.6c2.3-.5 4.7-1.1 7-1.6c1.9-.4 3.7-.9 5.6-1.3\" fill=\"none\" stroke=\"#ff5a62\" stroke-opacity=\"1\" stroke-width=\"1.1\" stroke-linecap=\"round\"/>\n    <path d=\"M133.7 -104.2c3.8-.1 7.6 .1 11.3-.4c3.4-.4 6.7-1.3 10-2.2c3.4-.9 6.7-1.9 10-3.1c3.1-1.1 6.1-2.3 9-3.7c2.3-1 4.6-2.1 6.7-3.5c1.1-.8 2-1.9 3-2.9\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".5\" stroke-width=\".5\" stroke-linecap=\"round\"/>\n  </g>\n  <g transform=\"matrix(1 .35532 0 1 0 714)\">\n    <rect class=\"ef-jamb-l\" x=\"0\" y=\"0\" width=\"5.5\" height=\"250\" fill=\"#232528\"/>\n    <rect class=\"ef-jamb-r\" x=\"230.5\" y=\"0\" width=\"4.5\" height=\"250\" fill=\"#232528\"/>\n    <path d=\"M231.2 0V250M4.8 0V250\" stroke=\"#fff\" stroke-opacity=\".18\" stroke-width=\"1\"/>\n    <rect x=\"0\" y=\"0\" width=\"235\" height=\"62\" fill=\"url(#ef-garage-lintel-shade)\"/>\n  </g>\n</g>\n<g id=\"ef-shutter\" clip-path=\"url(#ef-garage-opening)\"><g id=\"ef-shutter-slide\"><use href=\"#ef-garage-door\"/>\n</g>\n<g class=\"ef-light-only\"><path id=\"ef-shutter-shade\" d=\"M0 714 235 797.5 235 857.5 0 774Z\" fill=\"url(#ef-lintel-shade)\"/></g></g>\n<path d=\"M235 797.5 244 788 244 1055 235 1047.5Z\" style=\"fill:var(--ef-jamb,#0f0f0f)\"/>\n<g class=\"ef-light-only\">\n  <path class=\"ef-open-jamb\" d=\"M0 711 5.5 713 5.5 961 0 964Z\" fill=\"url(#ef-jamb-return)\" clip-path=\"url(#ef-garage-opening)\"/>\n  <path class=\"ef-open-jamb\" d=\"M0 963.2 235 1046.7V1050.4L0 966.9Z\" fill=\"url(#ef-garage-sill)\"/>\n</g>\n<g class=\"ef-snowcap\"><path id=\"ef-garage-snow\" d=\"M0 714L0 714 6.7 714.9 13.4 715.9 20.1 717.9 26.9 720.1 33.6 722.5 40.3 724.9 47 727.4 53.7 729.9 60.4 732.3 67.1 734.7 73.9 737.1 80.6 739.5 87.3 741.9 94 744.3 100.7 746.7 107.4 749.2 114.1 751.6 120.9 754 127.6 756.5 134.3 759.1 141 761.6 147.7 764 154.4 766.4 161.1 768.7 167.9 771.1 174.6 773.4 181.3 775.7 188 777.8 194.7 779.9 201.4 782 208.1 784.4 214.9 787.1 221.6 790 228.3 793.8 235 797.5L235 797.5Z\"/><path d=\"M0 968L0 968 8.3 970.9 16.6 974.3 24.9 978.8 33.1 983 41.4 986.3 49.7 990 58 993.8 66.3 997.5 74.6 1000.7 82.9 1001.7 91.1 1000.8 99.4 1003.3 107.7 1006.3 116 1009.2 124.3 1012.1 132.6 1015.1 140.9 1019 149.1 1022.4 157.4 1027.4 165.7 1033.4 174 1038.8 182.3 1042.5 190.6 1044.4 198.9 1045.2 207.1 1046 215.4 1047.8 223.7 1050.1 232 1051.2 240.3 1053.3 248.6 1056.3 256.9 1059.2 265.1 1062.2 273.4 1065.8 281.7 1070 290 1071L290 1071Z\"/></g>\n<g>\n<path d=\"M289 806 946 664.745 947.5 905 290 1071Z\" fill=\"url(#ef-wall)\"/>\n<path class=\"ef-light-only\" d=\"M289 806 946 664.745 947.5 922 290 1071Z\" fill=\"url(#ef-wall)\"/>\n<path class=\"ef-light-only\" d=\"M289 806 946 664.745 947.5 922 290 1071Z\" fill=\"url(#ef-stucco-relief)\" opacity=\".14\"/>\n<path class=\"ef-light-only\" d=\"M289 806 946 664.745 947.5 922 290 1071Z\" fill=\"url(#ef-wall-foot)\" mask=\"url(#ef-wall-foot-mask)\"/>\n<path class=\"ef-light-only\" d=\"M289 806 946 664.745 947.5 922 290 1071Z\" fill=\"url(#ef-wall-right)\" opacity=\".28\"/>\n<path class=\"ef-light-only\" d=\"M289 806 946 664.745 947.5 922 290 1071Z\" fill=\"url(#ef-wall-bounce)\"/>\n<g class=\"ef-light-only ef-window-wall-bounce\" clip-path=\"url(#ef-facade-clip)\">\n  <ellipse cx=\"844\" cy=\"878\" rx=\"112\" ry=\"42\" transform=\"rotate(-13 844 878)\" fill=\"url(#ef-window-spill-g)\" opacity=\"0\" style=\"opacity:calc(.42 * var(--ef-darkness,0))\"/>\n</g>\n<g class=\"ef-light-only\" clip-path=\"url(#ef-facade-clip)\">\n  <path d=\"M282 811 953 666.735\" fill=\"none\" stroke=\"#181a26\" stroke-width=\"15\" stroke-opacity=\".40\" filter=\"url(#ef-eave-penumbra)\"/>\n</g>\n<g class=\"ef-light-only\"><path d=\"M289 806 946 664.745 946.3 735.7235 289.2 877Z\" fill=\"url(#ef-eave-shade)\"/>\n<path d=\"M289 807.4 946 666.145\" fill=\"none\" stroke=\"#141620\" stroke-opacity=\".42\" stroke-width=\"2.6\"/>\n<path d=\"M70 513.5 289 806 289 818 60.5 520.5Z\" fill=\"url(#ef-rake-shade)\"/>\n<path d=\"M0 568 70 513.5 75.8 521 0 580Z\" fill=\"url(#ef-rake-shade-l)\"/>\n<path d=\"M0 569.4 70 515 289 807.4\" fill=\"none\" stroke=\"#181a24\" stroke-opacity=\".34\" stroke-width=\"2.4\" stroke-linejoin=\"round\" transform=\"translate(-.6 1.4)\"/>\n<path d=\"M289 806 345 793.6 345.5 1056.8 290 1071Z\" fill=\"url(#ef-corner-shade)\"/>\n<path d=\"M289.2 807 290 1070\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".28\" stroke-width=\"1.1\"/></g>\n</g>\n<g class=\"ef-light-only\" id=\"ef-plinth\">\n  <path d=\"M237 1034.9 290 1054.1V1072L237 1052.8Z\" fill=\"url(#ef-plinth-return)\"/>\n  <path d=\"M290 1054.1 947.5 911.3V929.1L290 1072Z\" fill=\"url(#ef-plinth-front)\"/>\n  <path d=\"M237 1034.9 290 1054.1 947.5 911.3V929.1L290 1072 237 1052.8Z\" fill=\"url(#ef-render-grain)\" opacity=\".13\"/>\n  <ellipse id=\"ef-b1-plinth-bounce\" cx=\"342\" cy=\"1056.6\" rx=\"14\" ry=\"10\" fill=\"url(#ef-strip-spill)\" opacity=\"0.16\" style=\"opacity:calc(.16 + .24 * var(--ef-darkness,0))\"/>\n  <ellipse id=\"ef-b2-plinth-bounce\" cx=\"454\" cy=\"1030.6\" rx=\"12\" ry=\"9\" fill=\"url(#ef-strip-spill-b2)\" opacity=\"0.14\" style=\"opacity:calc(.14 + .24 * var(--ef-darkness,0))\"/>\n  <path d=\"M237 1034.5 290 1053.7 947.5 910.9\" fill=\"none\" stroke=\"#f6f8fd\" stroke-opacity=\".6\" stroke-width=\"1.1\"/>\n  <path d=\"M237 1035.9 290 1055.1 947.5 912.3\" fill=\"none\" stroke=\"#161822\" stroke-opacity=\".54\" stroke-width=\"1.05\"/>\n  <path d=\"M289.6 1054.3V1070.6\" fill=\"none\" stroke=\"#141620\" stroke-opacity=\".68\" stroke-width=\"1.15\"/>\n</g>\n<g class=\"ef-light-only\" fill=\"none\">\n  <g clip-path=\"url(#ef-facade-clip)\">\n    <path d=\"M561 828 591 822 594 901 564 908Z\" transform=\"translate(-4 4)\" fill=\"#272736\" opacity=\".51\" filter=\"url(#ef-wall-shadow)\"/>\n  </g>\n</g>\n<g class=\"ef-frost\"><path d=\"M289 806 946 664.745 947.5 905 290 1071Z\" fill=\"url(#ef-frost-front-foot)\" filter=\"url(#ef-frost-ice)\"/></g>\n<g class=\"ef-snowcap\"><path d=\"M290 1071L290 1071 308.8 1071.9 327.6 1066 346.4 1058.8 365.1 1052.2 383.9 1047.8 402.7 1045.5 421.5 1044.5 440.3 1042.9 459.1 1039 477.9 1031.5 496.6 1021.2 515.4 1014.1 534.2 1009.3 553 1004.6 571.8 999.9 590.6 999.5 609.4 998.1 628.1 993.9 646.9 989.5 665.7 985.4 684.5 981.1 703.3 976.5 722.1 972 740.9 968 759.6 964 778.4 959.4 797.2 953.5 816 945.2 834.8 936.3 853.6 928.7 872.4 924 891.1 919.2 909.9 914.5 928.7 909.7 947.5 905L947.5 905Z\"/></g>\n</g>\n<g id=\"ef-lines\">\n  <g id=\"ef-l-b2\" class=\"ef-line\">\n    <use href=\"#ef-rail-b2\" class=\"ef-lane\"/>\n    <use href=\"#ef-rail-b2\" class=\"ef-pipe-shade\"/>\n    <g id=\"ef-f-b2\" transform=\"matrix(1 -.215 0 1 0 0)\" class=\"ef-flow\" data-route=\"ef-route-b2\" data-junction-end=\"\" data-flow=\"out\" style=\"--ef-source-color:var(--ef-b2-color,#4aa5f2)\">\n      <g class=\"ef-front\" transform=\"translate(0 1.1)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-b2\"/>\n      </g>\n      <g class=\"ef-top\" transform=\"translate(0 995.05) matrix(1 0 1.76 1 0 0) translate(0 -1000.45)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-b2\"/>\n      </g>\n    </g>\n    <g id=\"ef-f-b2-2\" transform=\"matrix(1 -.215 0 1 0 0)\" class=\"ef-flow\" data-route=\"ef-route-b2\" data-junction-end=\"\" data-flow=\"out\" style=\"--ef-source-color:var(--ef-b2-color,#4aa5f2)\">\n      <g class=\"ef-front\" transform=\"translate(0 1.1)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-b2\"/>\n      </g>\n      <g class=\"ef-top\" transform=\"translate(0 995.05) matrix(1 0 1.76 1 0 0) translate(0 -1000.45)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-b2\"/>\n      </g>\n    </g>\n    <g id=\"ef-f-b2-3\" transform=\"matrix(1 -.215 0 1 0 0)\" class=\"ef-flow\" data-route=\"ef-route-b2\" data-junction-end=\"\" data-flow=\"out\" style=\"--ef-source-color:var(--ef-b2-color,#4aa5f2)\">\n      <g class=\"ef-front\" transform=\"translate(0 1.1)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-b2\"/>\n      </g>\n      <g class=\"ef-top\" transform=\"translate(0 995.05) matrix(1 0 1.76 1 0 0) translate(0 -1000.45)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-b2\"/>\n      </g>\n    </g>\n    <g id=\"ef-f-b2-4\" transform=\"matrix(1 -.215 0 1 0 0)\" class=\"ef-flow\" data-route=\"ef-route-b2\" data-junction-end=\"\" data-flow=\"out\" style=\"--ef-source-color:var(--ef-b2-color,#4aa5f2)\">\n      <g class=\"ef-front\" transform=\"translate(0 1.1)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-b2\"/>\n      </g>\n      <g class=\"ef-top\" transform=\"translate(0 995.05) matrix(1 0 1.76 1 0 0) translate(0 -1000.45)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-b2\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-b2\"/>\n      </g>\n    </g>\n  </g>\n  <g id=\"ef-l-h1\" class=\"ef-line\" style=\"transform:translateY(0px)\">\n    <use href=\"#ef-rail-house\" class=\"ef-lane\"/>\n    <use href=\"#ef-rail-house\" class=\"ef-pipe-shade\"/>\n    <use id=\"ef-f-h1\" class=\"ef-flow\" data-route=\"ef-route-house\" data-flow=\"out\" href=\"#ef-house-pulse\" style=\"--ef-source-color:var(--ef-b1-color,#4dbd80)\"/>\n  </g>\n  <g id=\"ef-l-h2\" class=\"ef-line\" style=\"transform:translateY(-19px)\">\n    <use href=\"#ef-rail-house\" class=\"ef-lane\"/>\n    <use href=\"#ef-rail-house\" class=\"ef-pipe-shade\"/>\n    <use id=\"ef-f-h2\" class=\"ef-flow\" data-route=\"ef-route-house\" data-flow=\"out\" href=\"#ef-house-pulse\" style=\"--ef-source-color:var(--ef-solar-color,#d6a62c)\"/>\n  </g>\n  <g id=\"ef-l-h3\" class=\"ef-line\" style=\"transform:translateY(19px)\">\n    <use href=\"#ef-rail-house\" class=\"ef-lane\"/>\n    <use href=\"#ef-rail-house\" class=\"ef-pipe-shade\"/>\n    <use id=\"ef-f-h3\" class=\"ef-flow\" data-route=\"ef-route-house\" data-flow=\"out\" href=\"#ef-house-pulse\" style=\"--ef-source-color:var(--ef-b2-color,#4aa5f2)\"/>\n  </g>\n  <g id=\"ef-l-h4\" class=\"ef-line ef-gone\" style=\"transform:translateY(28.5px)\">\n    <use href=\"#ef-rail-house\" class=\"ef-lane\"/>\n    <use href=\"#ef-rail-house\" class=\"ef-pipe-shade\"/>\n    <use id=\"ef-f-h4\" class=\"ef-flow\" data-route=\"ef-route-house\" data-flow=\"out\" href=\"#ef-house-pulse\" style=\"--ef-source-color:var(--ef-grid-color,#cfd3d6)\"/>\n  </g>\n  <g id=\"ef-l-h5\" class=\"ef-line ef-gone\" style=\"transform:translateY(47.5px)\">\n    <use href=\"#ef-rail-house\" class=\"ef-lane\"/>\n    <use href=\"#ef-rail-house\" class=\"ef-pipe-shade\"/>\n    <use id=\"ef-f-h5\" class=\"ef-flow\" data-route=\"ef-route-house\" data-flow=\"out\" href=\"#ef-house-pulse\" style=\"--ef-source-color:var(--ef-ev-color,#9b7bea)\"/>\n  </g>\n</g>\n<g class=\"ef-grid-pipe\">\n  <use href=\"#ef-rail-grid\" class=\"ef-lane\"/>\n  <g id=\"ef-f-grid\" class=\"ef-flow\" data-route=\"ef-route-grid\" data-flow=\"off\" style=\"--ef-source-color:var(--ef-grid-color,#cfd3d6)\">\n    <g data-head-skew=\"-6.5:14.34 2.5:0 6.5:1.46\" data-head-ramp=\"26\">\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p10\" href=\"#ef-route-grid-riser\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p25\" href=\"#ef-route-grid-riser\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p40\" href=\"#ef-route-grid-riser\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p51\" href=\"#ef-route-grid-riser\"/>\n    </g>\n    <g clip-path=\"url(#ef-grid-seam)\">\n      <g class=\"ef-grid-top\" style=\"--ef-junction:-82.34\" transform=\"matrix(0.9398 0.34177 -1.8398 0.395 594 994.4)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-grid-top\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-grid-top\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-grid-top\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-grid-top\"/>\n      </g>\n      <g class=\"ef-grid-side\" style=\"--ef-junction:-95.24\" transform=\"matrix(0.9398 0.34177 0 1.06406 594 994.4)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-grid-side\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-grid-side\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-grid-side\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-grid-side\"/>\n      </g>\n    </g>\n  </g>\n  <g id=\"ef-f-grid2\" class=\"ef-flow\" data-route=\"ef-route-grid\" data-flow=\"off\" style=\"--ef-source-color:var(--ef-grid-color,#cfd3d6)\">\n    <g data-head-skew=\"-6.5:14.34 2.5:0 6.5:1.46\" data-head-ramp=\"26\">\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p10\" href=\"#ef-route-grid-riser\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p25\" href=\"#ef-route-grid-riser\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p40\" href=\"#ef-route-grid-riser\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p51\" href=\"#ef-route-grid-riser\"/>\n    </g>\n    <g clip-path=\"url(#ef-grid-seam)\">\n      <g class=\"ef-grid-top\" style=\"--ef-junction:-82.34\" transform=\"matrix(0.9398 0.34177 -1.8398 0.395 594 994.4)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-grid-top\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-grid-top\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-grid-top\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-grid-top\"/>\n      </g>\n      <g class=\"ef-grid-side\" style=\"--ef-junction:-95.24\" transform=\"matrix(0.9398 0.34177 0 1.06406 594 994.4)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-grid-side\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-grid-side\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-grid-side\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-grid-side\"/>\n      </g>\n    </g>\n  </g>\n  <g id=\"ef-f-grid3\" class=\"ef-flow\" data-route=\"ef-route-grid\" data-flow=\"off\" style=\"--ef-source-color:var(--ef-grid-color,#cfd3d6)\">\n    <g data-head-skew=\"-6.5:14.34 2.5:0 6.5:1.46\" data-head-ramp=\"26\">\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p10\" href=\"#ef-route-grid-riser\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p25\" href=\"#ef-route-grid-riser\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p40\" href=\"#ef-route-grid-riser\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p51\" href=\"#ef-route-grid-riser\"/>\n    </g>\n    <g clip-path=\"url(#ef-grid-seam)\">\n      <g class=\"ef-grid-top\" style=\"--ef-junction:-82.34\" transform=\"matrix(0.9398 0.34177 -1.8398 0.395 594 994.4)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-grid-top\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-grid-top\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-grid-top\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-grid-top\"/>\n      </g>\n      <g class=\"ef-grid-side\" style=\"--ef-junction:-95.24\" transform=\"matrix(0.9398 0.34177 0 1.06406 594 994.4)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-grid-side\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-grid-side\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-grid-side\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-grid-side\"/>\n      </g>\n    </g>\n  </g>\n  <g id=\"ef-f-grid4\" class=\"ef-flow\" data-route=\"ef-route-grid\" data-flow=\"off\" style=\"--ef-source-color:var(--ef-grid-color,#cfd3d6)\">\n    <g data-head-skew=\"-6.5:14.34 2.5:0 6.5:1.46\" data-head-ramp=\"26\">\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p10\" href=\"#ef-route-grid-riser\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p25\" href=\"#ef-route-grid-riser\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p40\" href=\"#ef-route-grid-riser\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p51\" href=\"#ef-route-grid-riser\"/>\n    </g>\n    <g clip-path=\"url(#ef-grid-seam)\">\n      <g class=\"ef-grid-top\" style=\"--ef-junction:-82.34\" transform=\"matrix(0.9398 0.34177 -1.8398 0.395 594 994.4)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-grid-top\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-grid-top\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-grid-top\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-grid-top\"/>\n      </g>\n      <g class=\"ef-grid-side\" style=\"--ef-junction:-95.24\" transform=\"matrix(0.9398 0.34177 0 1.06406 594 994.4)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-grid-side\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-grid-side\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-grid-side\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-grid-side\"/>\n      </g>\n    </g>\n  </g>\n  <use href=\"#ef-rail-grid\" class=\"ef-pipe-shade\"/>\n</g>\n<path id=\"ef-grid-end\" d=\"M850 1087.5L962 1128.2\" fill=\"none\" stroke=\"url(#ef-grid-fade)\" stroke-width=\"15\"/>\n<path class=\"ef-light-only\" d=\"M757 893.8L931.8 856.218\" fill=\"none\" stroke=\"#22252e\" stroke-width=\"1.35\" opacity=\".55\"/>\n<path d=\"M757 734.5 931.5 696.9825 931.5 855.4825 757 893Z\" fill=\"#141414\"/>\n<path d=\"M760.5 736.2 928 700.1875 928 853.3875 760.5 889.4Z\" fill=\"#0c0c0c\"/>\n<g class=\"ef-light-only\" fill=\"none\">\n  <path d=\"M757.5 892.2V734.8L931.2 697.4545\" stroke=\"#7d818b\" stroke-width=\".85\"/>\n  <path d=\"M757.2 892.4L931.2 854.99V697.39\" stroke=\"#b6bcc8\" stroke-width=\"1.15\"/>\n  <path d=\"M761 888.4V736.8L927.5 701.0025\" stroke=\"#1b1d24\" stroke-width=\"1.2\"/>\n  <path d=\"M761.2 888.4L927.5 852.6455V701.0455\" stroke=\"#9aa0ac\" stroke-width=\"1.05\"/>\n  <path d=\"M844.5 716.8V869.4\" stroke=\"#14161b\" stroke-width=\"1.45\"/>\n  <path d=\"M846.0 717.5V866.5\" stroke=\"#8a8f9b\" stroke-width=\".75\" opacity=\".86\"/>\n  <path d=\"M843.0 718.2V867.2\" stroke=\"#747984\" stroke-width=\".65\" opacity=\".78\"/>\n  <path class=\"ef-sash ef-sash1\" d=\"M769.2 802.4L837.8 787.651M851.2 784.77L919.3 770.1285\" stroke=\"#babec6\" stroke-width=\"1.15\" opacity=\".88\"/>\n  <path class=\"ef-sash ef-sash2\" d=\"M769.2 873.3L837.8 858.551M851.2 855.67L919.3 841.0285M838 728.7725V787.1725M919.5 711.25V769.65M838 799.3725V858.0725M919.5 781.85V840.55\" stroke=\"#cfc8bc\" stroke-width=\"1.05\" opacity=\".58\" style=\"opacity:calc(.58 + .32 * var(--ef-darkness,0))\"/>\n</g>\n<g fill=\"url(#ef-pane)\">\n<path d=\"M771 744.2 836.5 730.1175 836.5 786.4175 771 800.5Z\"/>\n<path d=\"M852.5 726.6775 917.5 712.7025 917.5 769.0025 852.5 782.9775Z\"/>\n<path d=\"M771 815.5 836.5 801.4175 836.5 857.6175 771 871.7Z\" opacity=\".92\"/>\n<path d=\"M852.5 797.9775 917.5 784.0025 917.5 840.2025 852.5 854.1775Z\" opacity=\".95\"/>\n</g>\n<g class=\"ef-light-only\">\n  <g fill=\"url(#ef-pane)\">\n    <path d=\"M769.5 743.5 837.5 728.88 837.5 787.28 769.5 801.9Z\"/>\n    <path d=\"M851.5 725.87 919 711.3575 919 769.7575 851.5 784.27Z\"/>\n    <path d=\"M769.5 814.1 837.5 799.48 837.5 858.18 769.5 872.8Z\"/>\n    <path d=\"M851.5 796.47 919 781.9575 919 840.6575 851.5 855.17Z\"/>\n  </g>\n  <g class=\"ef-pane-glow\">\n    <g clip-path=\"url(#ef-light-panes-clip)\">\n      <rect x=\"766\" y=\"706\" width=\"156\" height=\"172\" fill=\"url(#ef-pane-day-grad)\" opacity=\"1\" style=\"opacity:calc(1 - var(--ef-darkness,0))\"/>\n      <path d=\"M769.5 801.9V743.5L837.5 728.88M851.5 784.27V725.87L919 711.3575M769.5 872.8V814.1L837.5 799.48M851.5 855.17V796.47L919 781.9575\" fill=\"none\" stroke=\"#987e56\" stroke-width=\"5.2\" filter=\"url(#ef-pane-inner-shade)\" opacity=\"0.62\" style=\"opacity:calc(.62 * (1 - var(--ef-darkness,0)))\"/>\n      <rect x=\"766\" y=\"706\" width=\"156\" height=\"172\" fill=\"url(#ef-pane-night-grad)\" opacity=\"var(--ef-darkness,0)\"/>\n      <rect x=\"766\" y=\"706\" width=\"156\" height=\"172\" fill=\"url(#ef-pane-night-lift)\" opacity=\"var(--ef-darkness,0)\"/>\n    </g>\n    <path d=\"M769.5 801.9 837.5 787.28V728.88M851.5 784.27V725.87M769.5 814.1 837.5 799.48V858.18M851.5 855.17V796.47L919 781.9575\" fill=\"none\" stroke=\"#ffe7a8\" stroke-width=\"2.4\" filter=\"url(#ef-pane-inner-shade)\" opacity=\"0\" style=\"opacity:calc(.44 * var(--ef-darkness,0))\"/>\n  </g>\n</g>\n<path id=\"ef-room-dark\" d=\"M771 744.2 836.5 730.1175 836.5 786.4175 771 800.5ZM852.5 726.6775 917.5 712.7025 917.5 769.0025 852.5 782.9775ZM771 815.5 836.5 801.4175 836.5 857.6175 771 871.7ZM852.5 797.9775 917.5 784.0025 917.5 840.2025 852.5 854.1775Z\" style=\"d:var(--ef-room-dark-d,revert-layer)\" fill=\"#14161b\"/>\n<clipPath id=\"ef-window-panes\"><path d=\"M771 744.2 836.5 730.1175 836.5 786.4175 771 800.5ZM852.5 726.6775 917.5 712.7025 917.5 769.0025 852.5 782.9775ZM771 815.5 836.5 801.4175 836.5 857.6175 771 871.7ZM852.5 797.9775 917.5 784.0025 917.5 840.2025 852.5 854.1775Z\"/></clipPath>\n<filter id=\"ef-xmas-frost\" x=\"-20%\" y=\"-20%\" width=\"140%\" height=\"140%\"><feGaussianBlur stdDeviation=\"2.6\"/></filter>\n<radialGradient id=\"ef-xmas-room\" gradientUnits=\"userSpaceOnUse\" cx=\"830\" cy=\"800\" r=\"110\"><stop offset=\"0\" stop-color=\"#ffd08a\"/><stop offset=\".6\" stop-color=\"#f2ac62\"/><stop offset=\"1\" stop-color=\"#c97a3c\"/></radialGradient>\n<radialGradient id=\"ef-xmas-ice\" gradientUnits=\"userSpaceOnUse\" cx=\"844\" cy=\"792\" r=\"100\"><stop offset=\".45\" stop-color=\"#fff6ea\" stop-opacity=\"0\"/><stop offset=\"1\" stop-color=\"#fff6ea\" stop-opacity=\".55\"/></radialGradient>\n<g class=\"ef-xmas\" id=\"ef-xmas-tree\" clip-path=\"url(#ef-window-panes)\">\n  <rect x=\"760\" y=\"700\" width=\"170\" height=\"180\" fill=\"url(#ef-xmas-room)\" class=\"ef-xmas-room\"/>\n  <g filter=\"url(#ef-xmas-frost)\">\n    <ellipse cx=\"880\" cy=\"760\" rx=\"22\" ry=\"16\" fill=\"#ffe7b8\" opacity=\".7\"/>\n    <path d=\"M800 862h6v12h-6z\" fill=\"#2a1a10\"/>\n    <path d=\"M803 748C807.9 762 814.2 770 817 776Q803 782 789 776C791.8 770 798.1 762 803 748ZM803 760C810.35 779 819.8 792 824 798Q803 804 782 798C786.2 792 795.65 779 803 760ZM803 774C812.8 798 825.4 816 831 822Q803 828 775 822C780.6 816 793.2 798 803 774ZM803 790C814.9 819 830.2 842 837 848Q803 854 769 848C775.8 842 791.1 819 803 790ZM803 808C817 838 835 862 843 868Q803 874 763 868C771 862 789 838 803 808Z\" fill=\"#1d3a28\"/>\n    <circle cx=\"802.5\" cy=\"757.6\" r=\"2.6\" fill=\"#ffc25e\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:0;animation-duration:5.30s;animation-delay:-2.16s\"/><circle cx=\"804.3\" cy=\"757.9\" r=\"2.6\" fill=\"#ffc25e\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:7;animation-duration:5.45s;animation-delay:-2.09s\"/><circle cx=\"799.5\" cy=\"764.4\" r=\"3.3\" fill=\"#ffc25e\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:14;animation-duration:3.19s;animation-delay:-1.16s\"/><circle cx=\"804.7\" cy=\"769.9\" r=\"3.6\" fill=\"#ffd27a\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:21;animation-duration:3.16s;animation-delay:-3.14s\"/><circle cx=\"802.3\" cy=\"774.3\" r=\"3.5\" fill=\"#ffe2a6\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:28;animation-duration:5.72s;animation-delay:-3.99s\"/><circle cx=\"801.5\" cy=\"760.3\" r=\"2.8\" fill=\"#ffb64d\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:1;animation-duration:2.97s;animation-delay:-0.63s\"/><circle cx=\"794.6\" cy=\"796.9\" r=\"2.6\" fill=\"#ffc25e\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:8;animation-duration:4.61s;animation-delay:-3.66s\"/><circle cx=\"795.9\" cy=\"793.7\" r=\"3.9\" fill=\"#ffd27a\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:15;animation-duration:6.30s;animation-delay:-2.06s\"/><circle cx=\"804.6\" cy=\"791.4\" r=\"2.5\" fill=\"#ffc25e\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:22;animation-duration:3.62s;animation-delay:-3.78s\"/><circle cx=\"818.5\" cy=\"794.4\" r=\"3.9\" fill=\"#ffe2a6\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:29;animation-duration:4.20s;animation-delay:-3.20s\"/><circle cx=\"795.5\" cy=\"784.7\" r=\"3.2\" fill=\"#ffd27a\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:2;animation-duration:5.85s;animation-delay:-1.80s\"/><circle cx=\"806.2\" cy=\"771.9\" r=\"3.3\" fill=\"#ffe2a6\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:9;animation-duration:5.77s;animation-delay:-3.03s\"/><circle cx=\"805.8\" cy=\"799.9\" r=\"3.3\" fill=\"#ffe2a6\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:16;animation-duration:5.41s;animation-delay:-2.38s\"/><circle cx=\"811\" cy=\"810.3\" r=\"3.4\" fill=\"#ffd27a\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:23;animation-duration:4.09s;animation-delay:-2.36s\"/><circle cx=\"792.2\" cy=\"798.7\" r=\"3.8\" fill=\"#ffd27a\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:30;animation-duration:3.36s;animation-delay:-0.97s\"/><circle cx=\"806.1\" cy=\"818\" r=\"3.9\" fill=\"#ffc25e\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:3;animation-duration:5.25s;animation-delay:-1.84s\"/><circle cx=\"821.5\" cy=\"819.3\" r=\"3.1\" fill=\"#ffb64d\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:10;animation-duration:6.11s;animation-delay:-1.84s\"/><circle cx=\"821.3\" cy=\"820.1\" r=\"2.4\" fill=\"#ffb64d\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:17;animation-duration:2.81s;animation-delay:-1.38s\"/><circle cx=\"785.6\" cy=\"846.6\" r=\"2.9\" fill=\"#ffb64d\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:24;animation-duration:5.64s;animation-delay:-2.24s\"/><circle cx=\"817.3\" cy=\"829\" r=\"2.6\" fill=\"#ffd27a\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:31;animation-duration:3.04s;animation-delay:-1.25s\"/><circle cx=\"802.5\" cy=\"836.5\" r=\"3.5\" fill=\"#ffc25e\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:4;animation-duration:4.15s;animation-delay:-3.85s\"/><circle cx=\"800.5\" cy=\"818\" r=\"3.2\" fill=\"#ffe2a6\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:11;animation-duration:5.66s;animation-delay:-2.03s\"/><circle cx=\"817.9\" cy=\"832.3\" r=\"3.5\" fill=\"#ffd27a\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:18;animation-duration:3.55s;animation-delay:-1.12s\"/><circle cx=\"810.7\" cy=\"813.8\" r=\"2.5\" fill=\"#ffd27a\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:25;animation-duration:4.09s;animation-delay:-1.16s\"/><circle cx=\"805.9\" cy=\"828.2\" r=\"3.7\" fill=\"#ffe2a6\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:32;animation-duration:2.52s;animation-delay:-1.72s\"/><circle cx=\"794.9\" cy=\"864.4\" r=\"2.9\" fill=\"#ffc25e\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:5;animation-duration:6.23s;animation-delay:-0.39s\"/><circle cx=\"805.2\" cy=\"828\" r=\"3.0\" fill=\"#ffd27a\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:12;animation-duration:5.84s;animation-delay:-3.00s\"/><circle cx=\"786.6\" cy=\"837.7\" r=\"3.6\" fill=\"#ffc25e\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:19;animation-duration:2.55s;animation-delay:-0.69s\"/><circle cx=\"805.7\" cy=\"842.8\" r=\"2.5\" fill=\"#ffc25e\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:26;animation-duration:3.10s;animation-delay:-1.80s\"/><circle cx=\"787.2\" cy=\"857.9\" r=\"3.9\" fill=\"#ffc25e\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:33;animation-duration:4.65s;animation-delay:-2.05s\"/><circle cx=\"786\" cy=\"830\" r=\"3.9\" fill=\"#e0574f\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:6;animation-duration:6.34s;animation-delay:-3.49s\"/><circle cx=\"822\" cy=\"812\" r=\"3.1\" fill=\"#e0574f\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:13;animation-duration:3.15s;animation-delay:-1.26s\"/><circle cx=\"812\" cy=\"852\" r=\"3.0\" fill=\"#7fa6e8\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:20;animation-duration:4.29s;animation-delay:-3.07s\"/><circle cx=\"793\" cy=\"798\" r=\"3.3\" fill=\"#7fa6e8\" class=\"ef-twinkle ef-xmas-bokeh\" style=\"--i:27;animation-duration:5.61s;animation-delay:-0.54s\"/>\n    <circle cx=\"803\" cy=\"747\" r=\"4.5\" fill=\"#fff0bd\"/>\n  </g>\n  <rect x=\"760\" y=\"700\" width=\"170\" height=\"180\" fill=\"url(#ef-xmas-ice)\"/>\n</g>\n<g class=\"ef-snowcap\"><path transform=\"matrix(1 0.02944444 0 1 0 -22.40722222)\" d=\"M761 889L761 889 765.8 885.2 770.5 882 775.3 880.7 780 879.5 784.8 878.3 789.5 877.3 794.3 876.3 799.1 875.3 803.8 874.2 808.6 872.9 813.3 871.5 818.1 870.1 822.8 868.9 827.6 867.8 832.4 866.8 837.1 865.8 841.9 864.7 846.6 863.6 851.4 862.6 856.1 861.8 860.9 860.9 865.7 859.8 870.4 858.7 875.2 857.7 879.9 856.7 884.7 855.6 889.4 854.4 894.2 853 899 851.5 903.7 850.1 908.5 848.9 913.2 848.1 918 847.4 922.7 847.9 927.5 848.3L927.5 848.3Z\"/><path transform=\"matrix(1 0.01858779 0 1 0 -14.33118321)\" d=\"M771 800.5L771 793.7 772.9 794 774.7 794.3 776.6 794.6 778.5 794.7 780.4 794.8 782.2 795 784.1 795.2 786 795.2 787.8 795 789.7 794.7 791.6 794.3 793.5 793.9 795.3 793.6 797.2 793.3 799.1 793.1 800.9 792.8 802.8 792.5 804.7 792.1 806.6 791.6 808.4 791 810.3 790.3 812.2 789.8 814 789.1 815.9 788.5 817.8 787.7 819.7 786.9 821.5 786.2 823.4 785.6 825.3 785 827.1 784.3 829 783.5 830.9 782.6 832.8 781.5 834.6 780.4 836.5 779.3L836.5 785.2Z\"/><path transform=\"matrix(1 0.01730769 0 1 0 -13.17730769)\" d=\"M852.5 781.4L852.5 776.1 854.4 776.1 856.2 775.9 858.1 775.7 859.9 775.6 861.8 775.7 863.6 775.9 865.5 776 867.4 776 869.2 775.9 871.1 775.6 872.9 775.2 874.8 774.8 876.6 774.5 878.5 774.2 880.4 773.8 882.2 773.4 884.1 773 885.9 772.6 887.8 772.2 889.6 771.8 891.5 771.4 893.4 770.9 895.2 770.4 897.1 769.7 898.9 768.9 900.8 768.1 902.6 767.4 904.5 766.8 906.4 766.2 908.2 765.5 910.1 764.7 911.9 764 913.8 763.4 915.6 762.8 917.5 762L917.5 766.3Z\"/><path transform=\"matrix(1 0.02774809 0 1 0 -21.39377863)\" d=\"M771 871.7L771 868 772.9 868 774.7 867.8 776.6 867.7 778.5 867.6 780.4 867.3 782.2 866.8 784.1 866.2 786 865.8 787.8 865.5 789.7 865.5 791.6 865.5 793.5 865.3 795.3 865 797.2 864.6 799.1 864.2 800.9 863.7 802.8 863.3 804.7 862.8 806.6 862.3 808.4 861.8 810.3 861.2 812.2 860.7 814 860.1 815.9 859.5 817.8 859 819.7 858.3 821.5 857.6 823.4 856.9 825.3 856.1 827.1 855.2 829 854.4 830.9 853.7 832.8 853.2 834.6 852.6 836.5 851.9L836.5 855.8Z\"/><path transform=\"matrix(1 0.02653846 0 1 0 -20.34653846)\" d=\"M852.5 851.9L852.5 847.1 854.4 847.2 856.2 847.4 858.1 847.5 859.9 847.5 861.8 847.3 863.6 847 865.5 846.6 867.4 846.3 869.2 846.1 871.1 845.9 872.9 845.6 874.8 845.3 876.6 845 878.5 844.7 880.4 844.2 882.2 843.7 884.1 843.3 885.9 842.8 887.8 842.5 889.6 842.1 891.5 841.8 893.4 841.3 895.2 840.6 897.1 839.8 898.9 838.9 900.8 838 902.6 837.2 904.5 836.4 906.4 835.5 908.2 834.6 910.1 833.6 911.9 832.7 913.8 831.9 915.6 831 917.5 830L917.5 836.2Z\"/></g>\n<g class=\"ef-frost\" clip-path=\"url(#ef-window-panes)\"><g fill=\"url(#ef-frost-dot)\" filter=\"url(#ef-frost-ice)\"><circle cx=\"771\" cy=\"744.2\" r=\"29\"/><circle cx=\"836.5\" cy=\"730.1175\" r=\"15\"/><circle cx=\"836.5\" cy=\"786.4175\" r=\"24\"/><circle cx=\"771\" cy=\"800.5\" r=\"24\"/><circle cx=\"852.5\" cy=\"726.6775\" r=\"15\"/><circle cx=\"917.5\" cy=\"712.7025\" r=\"29\"/><circle cx=\"917.5\" cy=\"769.0025\" r=\"24\"/><circle cx=\"852.5\" cy=\"782.9775\" r=\"24\"/><circle cx=\"771\" cy=\"815.5\" r=\"15\"/><circle cx=\"836.5\" cy=\"801.4175\" r=\"15\"/><circle cx=\"836.5\" cy=\"857.6175\" r=\"24\"/><circle cx=\"771\" cy=\"871.7\" r=\"38\"/><circle cx=\"852.5\" cy=\"797.9775\" r=\"15\"/><circle cx=\"917.5\" cy=\"784.0025\" r=\"15\"/><circle cx=\"917.5\" cy=\"840.2025\" r=\"38\"/><circle cx=\"852.5\" cy=\"854.1775\" r=\"24\"/></g></g>\n<g class=\"ef-bake\">\n<path d=\"M63.5 512.5 68 511 286 800.94 286 807.94 281.5 809.44Z\" style=\"fill:var(--ef-roof-edge,#212121)\"/>\n<path d=\"M63.5 512.5 281.5 802.44\" fill=\"none\" style=\"stroke:var(--ef-roof-line,#1b1b1b)\" stroke-width=\"1.3\"/>\n<path d=\"M286 800.94 981 651.515 981 658.515 286 807.94Z\" style=\"fill:var(--ef-fascia,#141414)\"/>\n<path d=\"M68 511 763 361.575 981 651.515 286 800.94Z\" fill=\"url(#ef-roof)\"/>\n<use href=\"#ef-pv-cast-shadow\"/>\n<g class=\"ef-frost\"><path d=\"M68 511 763 361.575 981 651.515 286 800.94Z\" fill=\"url(#ef-frost-roof)\" filter=\"url(#ef-frost-ice)\"/></g>\n<path d=\"M286 800.94 981 651.515 763 361.575\" fill=\"none\" style=\"stroke:var(--ef-roof-ridge,#3a3a3a)\" stroke-width=\"1.4\"/>\n<path d=\"M68 511 763 361.575\" fill=\"none\" style=\"stroke:var(--ef-roof-line,#1a1a1a)\" stroke-width=\"1.5\"/>\n<g class=\"ef-light-only\">\n  <path d=\"M63.5 512.5 68 511 286 800.94 286 809.94 281.5 809.44Z\" fill=\"url(#ef-rake-metal)\"/>\n  <path d=\"M286 800.94 981 651.515 981 660.515 286 809.94Z\" fill=\"url(#ef-fascia-metal)\"/>\n</g>\n<g class=\"ef-light-only\" clip-path=\"url(#ef-front-roof-plane)\">\n  <g opacity=\".33\"><use href=\"#ef-sun-coating-glint\"/><use href=\"#ef-moon-coating-glint\"/></g>\n  <g opacity=\".44\"><use href=\"#ef-sun-fold-glint\"/><use href=\"#ef-moon-fold-glint\"/></g>\n</g>\n<g class=\"ef-snowcap\"><path transform=\"matrix(1 -0.0178777 0 1 0 5.21568345)\" d=\"M68 507L68 507 89.8 505.7 110.1 502.4 130.2 498.8 150.3 495.2 170.4 491.6 190.7 488.3 211.2 485.2 231.6 482 251.7 478.4 271.5 474.6 291.3 470.5 311.1 466.5 330.9 462.5 350.8 458.6 370.6 454.6 390.3 450.5 410.1 446.5 429.9 442.5 449.6 438.4 469.2 434.2 488.9 430 508.6 426 528.5 422.1 548.5 418.4 568.5 414.6 588.4 410.7 608 406.6 627.6 402.2 647 397.7 666.5 393.4 686.2 389.2 706.1 385.3 726 381.5 745.5 377.2 763 370L763 370Z\"/><path transform=\"matrix(1.00460829 0.06423963 0 1 -3.51612903 -57.43983871)\" d=\"M980 646L980 646 971.9 639.6 965 632.3 958.2 624.8 951.6 617.3 945.2 609.6 939.1 601.6 933.4 593.3 927.5 585.2 921.4 577.2 915.1 569.4 908.8 561.6 902.6 553.8 896.3 545.9 889.9 538.2 883 530.9 876 523.6 869.3 516.1 863 508.3 857 500.2 851.1 492.1 845.2 484 839.1 476.1 833.1 468 827.3 459.8 821.6 451.6 815.6 443.5 809.4 435.6 803 427.8 796.6 420.2 790.3 412.3 784.3 404.3 778.6 396 773 387.6 767.5 379.2 763 370L763 370Z\"/><path transform=\"matrix(1.00144092 0.00803314 0 1 -0.41210375 -2.35747839)\" d=\"M286 801L286 801 300.2 789 319 783.1 338.4 778.2 357.9 773.3 377.2 768.2 396.5 763.1 415.9 758 435.3 753 454.8 748.2 474.7 743.8 495 739.9 515.2 736.1 535.2 731.9 555 727.5 575.1 723.3 595.2 719.2 615.2 715.1 634.9 710.5 653.6 704.5 671.7 697.8 690.2 691.6 709.7 686.7 729.7 682.5 749.6 678.1 769.5 673.8 789.6 669.7 810.1 666.2 831.3 663.7 852.8 661.5 874 658.8 894.4 655.2 914.3 651 934.3 646.7 955 643.4 980 646L980 646Z\"/><path transform=\"matrix(1.00144092 0.00803314 0 1 -0.41210375 -2.35747839)\" d=\"M286 801L286 801 305.8 797.6 325.7 794.2 345.5 790 365.3 785.7 385.1 781.3 405 776.7 424.8 772.1 444.6 767.5 464.5 763 484.3 758.5 504.1 753.9 523.9 749.2 543.8 744.7 563.6 740.3 583.4 735.9 603.3 731.5 623.1 727 642.9 722.6 662.7 718.2 682.6 713.8 702.4 709.3 722.2 704.9 742.1 700.6 761.9 696.4 781.7 692.2 801.5 687.9 821.4 683.4 841.2 678.9 861 674.4 880.9 669.8 900.7 665.4 920.5 661.1 940.3 656.9 960.2 651.7 980 646L980 646Z\"/></g>\n</g>\n<g class=\"ef-xmas\" id=\"ef-xmas-lights\" transform=\"matrix(1.00144092 0.00803314 0 1 -0.41210375 -2.35747839)\"><path d=\"M290 808 978 653 978 699 290 854Z\" fill=\"url(#ef-xmas-wash)\" class=\"ef-xmas-wash\"/><path d=\"M290 811.2Q296.4 812 302.7 808.3Q309.1 809.1 315.5 805.5Q321.9 806.2 328.2 802.6Q334.6 803.4 341 799.7Q347.3 800.5 353.7 796.8Q360.1 797.6 366.4 794Q372.8 794.7 379.2 791.1Q385.6 791.9 391.9 788.2Q398.3 789 404.7 785.4Q411 786.1 417.4 782.5Q423.8 783.3 430.1 779.6Q436.5 780.4 442.9 776.8Q449.3 777.5 455.6 773.9Q462 774.7 468.4 771Q474.7 771.8 481.1 768.1Q487.5 768.9 493.9 765.3Q500.2 766 506.6 762.4Q513 763.2 519.3 759.5Q525.7 760.3 532.1 756.7Q538.4 757.4 544.8 753.8Q551.2 754.6 557.6 750.9Q563.9 751.7 570.3 748.1Q576.7 748.8 583 745.2Q589.4 745.9 595.8 742.3Q602.1 743.1 608.5 739.4Q614.9 740.2 621.3 736.6Q627.6 737.3 634 733.7Q640.4 734.5 646.7 730.8Q653.1 731.6 659.5 728Q665.9 728.7 672.2 725.1Q678.6 725.9 685 722.2Q691.3 723 697.7 719.3Q704.1 720.1 710.4 716.5Q716.8 717.2 723.2 713.6Q729.6 714.4 735.9 710.7Q742.3 711.5 748.7 707.9Q755 708.6 761.4 705Q767.8 705.8 774.1 702.1Q780.5 702.9 786.9 699.3Q793.3 700 799.6 696.4Q806 697.2 812.4 693.5Q818.7 694.3 825.1 690.6Q831.5 691.4 837.9 687.8Q844.2 688.5 850.6 684.9Q857 685.7 863.3 682Q869.7 682.8 876.1 679.2Q882.4 679.9 888.8 676.3Q895.2 677.1 901.6 673.4Q907.9 674.2 914.3 670.6Q920.7 671.3 927 667.7Q933.4 668.4 939.8 664.8Q946.1 665.6 952.5 661.9Q958.9 662.7 965.3 659.1Q971.6 659.8 978 656.2\" class=\"ef-xmas-wire\"/><g class=\"ef-xmas-glow\"><circle cx=\"296.4\" cy=\"812.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:0;animation-duration:1.40s;animation-delay:-0.10s\"/><circle cx=\"309.1\" cy=\"809.6\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:1;animation-duration:2.23s;animation-delay:-2.20s\"/><circle cx=\"321.9\" cy=\"806.7\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:2;animation-duration:1.96s;animation-delay:-0.14s\"/><circle cx=\"334.6\" cy=\"803.9\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:3;animation-duration:1.58s;animation-delay:-2.46s\"/><circle cx=\"347.3\" cy=\"801\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:4;animation-duration:2.77s;animation-delay:-1.99s\"/><circle cx=\"360.1\" cy=\"798.1\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:5;animation-duration:3.21s;animation-delay:-3.79s\"/><circle cx=\"372.8\" cy=\"795.2\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:6;animation-duration:1.65s;animation-delay:-3.18s\"/><circle cx=\"385.6\" cy=\"792.4\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:7;animation-duration:1.91s;animation-delay:-0.73s\"/><circle cx=\"398.3\" cy=\"789.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:8;animation-duration:2.36s;animation-delay:-0.71s\"/><circle cx=\"411\" cy=\"786.6\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:9;animation-duration:3.20s;animation-delay:-2.15s\"/><circle cx=\"423.8\" cy=\"783.8\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:10;animation-duration:2.72s;animation-delay:-3.18s\"/><circle cx=\"436.5\" cy=\"780.9\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:11;animation-duration:2.60s;animation-delay:-1.60s\"/><circle cx=\"449.3\" cy=\"778\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:12;animation-duration:2.42s;animation-delay:-0.48s\"/><circle cx=\"462\" cy=\"775.2\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:13;animation-duration:1.65s;animation-delay:-0.16s\"/><circle cx=\"474.7\" cy=\"772.3\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:14;animation-duration:2.65s;animation-delay:-0.51s\"/><circle cx=\"487.5\" cy=\"769.4\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:15;animation-duration:3.46s;animation-delay:-2.12s\"/><circle cx=\"500.2\" cy=\"766.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:16;animation-duration:1.48s;animation-delay:-0.37s\"/><circle cx=\"513\" cy=\"763.7\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:17;animation-duration:3.45s;animation-delay:-2.20s\"/><circle cx=\"525.7\" cy=\"760.8\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:18;animation-duration:2.61s;animation-delay:-1.59s\"/><circle cx=\"538.4\" cy=\"757.9\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:19;animation-duration:3.15s;animation-delay:-1.61s\"/><circle cx=\"551.2\" cy=\"755.1\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:20;animation-duration:2.90s;animation-delay:-2.39s\"/><circle cx=\"563.9\" cy=\"752.2\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:21;animation-duration:2.77s;animation-delay:-1.31s\"/><circle cx=\"576.7\" cy=\"749.3\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:22;animation-duration:3.57s;animation-delay:-2.69s\"/><circle cx=\"589.4\" cy=\"746.4\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:23;animation-duration:2.56s;animation-delay:-1.39s\"/><circle cx=\"602.1\" cy=\"743.6\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:24;animation-duration:2.00s;animation-delay:-0.15s\"/><circle cx=\"614.9\" cy=\"740.7\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:25;animation-duration:2.78s;animation-delay:-3.95s\"/><circle cx=\"627.6\" cy=\"737.8\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:26;animation-duration:2.43s;animation-delay:-1.29s\"/><circle cx=\"640.4\" cy=\"735\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:27;animation-duration:1.98s;animation-delay:-3.32s\"/><circle cx=\"653.1\" cy=\"732.1\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:28;animation-duration:1.82s;animation-delay:-2.58s\"/><circle cx=\"665.9\" cy=\"729.2\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:29;animation-duration:3.41s;animation-delay:-1.57s\"/><circle cx=\"678.6\" cy=\"726.4\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:30;animation-duration:3.18s;animation-delay:-2.42s\"/><circle cx=\"691.3\" cy=\"723.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:31;animation-duration:3.32s;animation-delay:-1.35s\"/><circle cx=\"704.1\" cy=\"720.6\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:32;animation-duration:2.92s;animation-delay:-1.45s\"/><circle cx=\"716.8\" cy=\"717.7\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:33;animation-duration:1.67s;animation-delay:-0.35s\"/><circle cx=\"729.6\" cy=\"714.9\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:34;animation-duration:3.16s;animation-delay:-2.78s\"/><circle cx=\"742.3\" cy=\"712\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:35;animation-duration:2.54s;animation-delay:-3.34s\"/><circle cx=\"755\" cy=\"709.1\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:36;animation-duration:2.22s;animation-delay:-0.07s\"/><circle cx=\"767.8\" cy=\"706.3\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:37;animation-duration:1.81s;animation-delay:-2.73s\"/><circle cx=\"780.5\" cy=\"703.4\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:38;animation-duration:2.81s;animation-delay:-0.61s\"/><circle cx=\"793.3\" cy=\"700.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:39;animation-duration:2.53s;animation-delay:-2.86s\"/><circle cx=\"806\" cy=\"697.7\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:40;animation-duration:1.49s;animation-delay:-3.53s\"/><circle cx=\"818.7\" cy=\"694.8\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:41;animation-duration:2.20s;animation-delay:-3.34s\"/><circle cx=\"831.5\" cy=\"691.9\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:42;animation-duration:3.53s;animation-delay:-1.92s\"/><circle cx=\"844.2\" cy=\"689\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:43;animation-duration:3.45s;animation-delay:-2.74s\"/><circle cx=\"857\" cy=\"686.2\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:44;animation-duration:3.57s;animation-delay:-1.75s\"/><circle cx=\"869.7\" cy=\"683.3\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:45;animation-duration:2.20s;animation-delay:-0.18s\"/><circle cx=\"882.4\" cy=\"680.4\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:46;animation-duration:1.56s;animation-delay:-3.22s\"/><circle cx=\"895.2\" cy=\"677.6\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:47;animation-duration:2.71s;animation-delay:-1.83s\"/><circle cx=\"907.9\" cy=\"674.7\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:48;animation-duration:2.45s;animation-delay:-1.42s\"/><circle cx=\"920.7\" cy=\"671.8\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:49;animation-duration:1.83s;animation-delay:-2.22s\"/><circle cx=\"933.4\" cy=\"668.9\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:50;animation-duration:2.19s;animation-delay:-3.05s\"/><circle cx=\"946.1\" cy=\"666.1\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:51;animation-duration:2.73s;animation-delay:-0.41s\"/><circle cx=\"958.9\" cy=\"663.2\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:52;animation-duration:2.58s;animation-delay:-0.59s\"/><circle cx=\"971.6\" cy=\"660.3\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:53;animation-duration:2.40s;animation-delay:-3.04s\"/></g><g class=\"ef-xmas-bulbs\"><circle cx=\"296.4\" cy=\"812.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:0;animation-duration:1.40s;animation-delay:-0.10s\"/><circle cx=\"309.1\" cy=\"809.6\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:1;animation-duration:2.23s;animation-delay:-2.20s\"/><circle cx=\"321.9\" cy=\"806.7\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:2;animation-duration:1.96s;animation-delay:-0.14s\"/><circle cx=\"334.6\" cy=\"803.9\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:3;animation-duration:1.58s;animation-delay:-2.46s\"/><circle cx=\"347.3\" cy=\"801\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:4;animation-duration:2.77s;animation-delay:-1.99s\"/><circle cx=\"360.1\" cy=\"798.1\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:5;animation-duration:3.21s;animation-delay:-3.79s\"/><circle cx=\"372.8\" cy=\"795.2\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:6;animation-duration:1.65s;animation-delay:-3.18s\"/><circle cx=\"385.6\" cy=\"792.4\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:7;animation-duration:1.91s;animation-delay:-0.73s\"/><circle cx=\"398.3\" cy=\"789.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:8;animation-duration:2.36s;animation-delay:-0.71s\"/><circle cx=\"411\" cy=\"786.6\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:9;animation-duration:3.20s;animation-delay:-2.15s\"/><circle cx=\"423.8\" cy=\"783.8\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:10;animation-duration:2.72s;animation-delay:-3.18s\"/><circle cx=\"436.5\" cy=\"780.9\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:11;animation-duration:2.60s;animation-delay:-1.60s\"/><circle cx=\"449.3\" cy=\"778\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:12;animation-duration:2.42s;animation-delay:-0.48s\"/><circle cx=\"462\" cy=\"775.2\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:13;animation-duration:1.65s;animation-delay:-0.16s\"/><circle cx=\"474.7\" cy=\"772.3\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:14;animation-duration:2.65s;animation-delay:-0.51s\"/><circle cx=\"487.5\" cy=\"769.4\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:15;animation-duration:3.46s;animation-delay:-2.12s\"/><circle cx=\"500.2\" cy=\"766.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:16;animation-duration:1.48s;animation-delay:-0.37s\"/><circle cx=\"513\" cy=\"763.7\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:17;animation-duration:3.45s;animation-delay:-2.20s\"/><circle cx=\"525.7\" cy=\"760.8\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:18;animation-duration:2.61s;animation-delay:-1.59s\"/><circle cx=\"538.4\" cy=\"757.9\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:19;animation-duration:3.15s;animation-delay:-1.61s\"/><circle cx=\"551.2\" cy=\"755.1\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:20;animation-duration:2.90s;animation-delay:-2.39s\"/><circle cx=\"563.9\" cy=\"752.2\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:21;animation-duration:2.77s;animation-delay:-1.31s\"/><circle cx=\"576.7\" cy=\"749.3\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:22;animation-duration:3.57s;animation-delay:-2.69s\"/><circle cx=\"589.4\" cy=\"746.4\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:23;animation-duration:2.56s;animation-delay:-1.39s\"/><circle cx=\"602.1\" cy=\"743.6\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:24;animation-duration:2.00s;animation-delay:-0.15s\"/><circle cx=\"614.9\" cy=\"740.7\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:25;animation-duration:2.78s;animation-delay:-3.95s\"/><circle cx=\"627.6\" cy=\"737.8\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:26;animation-duration:2.43s;animation-delay:-1.29s\"/><circle cx=\"640.4\" cy=\"735\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:27;animation-duration:1.98s;animation-delay:-3.32s\"/><circle cx=\"653.1\" cy=\"732.1\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:28;animation-duration:1.82s;animation-delay:-2.58s\"/><circle cx=\"665.9\" cy=\"729.2\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:29;animation-duration:3.41s;animation-delay:-1.57s\"/><circle cx=\"678.6\" cy=\"726.4\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:30;animation-duration:3.18s;animation-delay:-2.42s\"/><circle cx=\"691.3\" cy=\"723.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:31;animation-duration:3.32s;animation-delay:-1.35s\"/><circle cx=\"704.1\" cy=\"720.6\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:32;animation-duration:2.92s;animation-delay:-1.45s\"/><circle cx=\"716.8\" cy=\"717.7\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:33;animation-duration:1.67s;animation-delay:-0.35s\"/><circle cx=\"729.6\" cy=\"714.9\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:34;animation-duration:3.16s;animation-delay:-2.78s\"/><circle cx=\"742.3\" cy=\"712\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:35;animation-duration:2.54s;animation-delay:-3.34s\"/><circle cx=\"755\" cy=\"709.1\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:36;animation-duration:2.22s;animation-delay:-0.07s\"/><circle cx=\"767.8\" cy=\"706.3\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:37;animation-duration:1.81s;animation-delay:-2.73s\"/><circle cx=\"780.5\" cy=\"703.4\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:38;animation-duration:2.81s;animation-delay:-0.61s\"/><circle cx=\"793.3\" cy=\"700.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:39;animation-duration:2.53s;animation-delay:-2.86s\"/><circle cx=\"806\" cy=\"697.7\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:40;animation-duration:1.49s;animation-delay:-3.53s\"/><circle cx=\"818.7\" cy=\"694.8\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:41;animation-duration:2.20s;animation-delay:-3.34s\"/><circle cx=\"831.5\" cy=\"691.9\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:42;animation-duration:3.53s;animation-delay:-1.92s\"/><circle cx=\"844.2\" cy=\"689\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:43;animation-duration:3.45s;animation-delay:-2.74s\"/><circle cx=\"857\" cy=\"686.2\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:44;animation-duration:3.57s;animation-delay:-1.75s\"/><circle cx=\"869.7\" cy=\"683.3\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:45;animation-duration:2.20s;animation-delay:-0.18s\"/><circle cx=\"882.4\" cy=\"680.4\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:46;animation-duration:1.56s;animation-delay:-3.22s\"/><circle cx=\"895.2\" cy=\"677.6\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:47;animation-duration:2.71s;animation-delay:-1.83s\"/><circle cx=\"907.9\" cy=\"674.7\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:48;animation-duration:2.45s;animation-delay:-1.42s\"/><circle cx=\"920.7\" cy=\"671.8\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:49;animation-duration:1.83s;animation-delay:-2.22s\"/><circle cx=\"933.4\" cy=\"668.9\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:50;animation-duration:2.19s;animation-delay:-3.05s\"/><circle cx=\"946.1\" cy=\"666.1\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:51;animation-duration:2.73s;animation-delay:-0.41s\"/><circle cx=\"958.9\" cy=\"663.2\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:52;animation-duration:2.58s;animation-delay:-0.59s\"/><circle cx=\"971.6\" cy=\"660.3\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:53;animation-duration:2.40s;animation-delay:-3.04s\"/></g><path d=\"M62.5 515Q66.4 522.5 70.3 525.5Q74.1 533 78 536Q81.9 543.5 85.8 546.5Q89.6 554 93.5 557Q97.4 564.5 101.3 567.5Q105.1 575 109 578Q112.9 585.5 116.8 588.5Q120.6 596 124.5 599Q128.4 606.5 132.3 609.5Q136.1 617 140 620Q143.9 627.5 147.8 630.5Q151.6 638 155.5 641Q159.4 648.5 163.3 651.5Q167.1 659 171 662Q174.9 669.5 178.8 672.5Q182.6 680 186.5 683Q190.4 690.5 194.3 693.5Q198.1 701 202 704Q205.9 711.5 209.8 714.5Q213.6 722 217.5 725Q221.4 732.5 225.3 735.5Q229.1 743 233 746Q236.9 753.5 240.8 756.5Q244.6 764 248.5 767Q252.4 774.5 256.3 777.5Q260.1 785 264 788Q267.9 795.5 271.8 798.5Q275.6 806 279.5 809\" class=\"ef-xmas-wire\"/><g class=\"ef-xmas-glow\"><circle cx=\"66.4\" cy=\"523\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:0;animation-duration:2.04s;animation-delay:-1.86s\"/><circle cx=\"74.1\" cy=\"533.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:1;animation-duration:3.54s;animation-delay:-0.84s\"/><circle cx=\"81.9\" cy=\"544\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:2;animation-duration:3.06s;animation-delay:-1.95s\"/><circle cx=\"89.6\" cy=\"554.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:3;animation-duration:2.22s;animation-delay:-1.47s\"/><circle cx=\"97.4\" cy=\"565\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:4;animation-duration:2.88s;animation-delay:-3.57s\"/><circle cx=\"105.1\" cy=\"575.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:5;animation-duration:2.36s;animation-delay:-4.00s\"/><circle cx=\"112.9\" cy=\"586\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:6;animation-duration:1.60s;animation-delay:-1.26s\"/><circle cx=\"120.6\" cy=\"596.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:7;animation-duration:1.55s;animation-delay:-2.11s\"/><circle cx=\"128.4\" cy=\"607\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:8;animation-duration:2.76s;animation-delay:-1.30s\"/><circle cx=\"136.1\" cy=\"617.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:9;animation-duration:2.66s;animation-delay:-2.07s\"/><circle cx=\"143.9\" cy=\"628\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:10;animation-duration:1.75s;animation-delay:-1.21s\"/><circle cx=\"151.6\" cy=\"638.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:11;animation-duration:2.28s;animation-delay:-3.99s\"/><circle cx=\"159.4\" cy=\"649\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:12;animation-duration:2.41s;animation-delay:-2.68s\"/><circle cx=\"167.1\" cy=\"659.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:13;animation-duration:3.32s;animation-delay:-3.67s\"/><circle cx=\"174.9\" cy=\"670\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:14;animation-duration:2.49s;animation-delay:-1.57s\"/><circle cx=\"182.6\" cy=\"680.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:15;animation-duration:2.51s;animation-delay:-1.79s\"/><circle cx=\"190.4\" cy=\"691\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:16;animation-duration:2.66s;animation-delay:-3.90s\"/><circle cx=\"198.1\" cy=\"701.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:17;animation-duration:3.14s;animation-delay:-1.63s\"/><circle cx=\"205.9\" cy=\"712\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:18;animation-duration:2.76s;animation-delay:-1.61s\"/><circle cx=\"213.6\" cy=\"722.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:19;animation-duration:1.98s;animation-delay:-3.97s\"/><circle cx=\"221.4\" cy=\"733\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:20;animation-duration:3.16s;animation-delay:-0.94s\"/><circle cx=\"229.1\" cy=\"743.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:21;animation-duration:2.88s;animation-delay:-0.42s\"/><circle cx=\"236.9\" cy=\"754\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:22;animation-duration:3.38s;animation-delay:-2.38s\"/><circle cx=\"244.6\" cy=\"764.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:23;animation-duration:2.15s;animation-delay:-1.89s\"/><circle cx=\"252.4\" cy=\"775\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:24;animation-duration:3.41s;animation-delay:-3.92s\"/><circle cx=\"260.1\" cy=\"785.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:25;animation-duration:2.05s;animation-delay:-1.88s\"/><circle cx=\"267.9\" cy=\"796\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:26;animation-duration:2.94s;animation-delay:-3.83s\"/><circle cx=\"275.6\" cy=\"806.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:27;animation-duration:3.50s;animation-delay:-2.70s\"/></g><g class=\"ef-xmas-bulbs\"><circle cx=\"66.4\" cy=\"523\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:0;animation-duration:2.04s;animation-delay:-1.86s\"/><circle cx=\"74.1\" cy=\"533.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:1;animation-duration:3.54s;animation-delay:-0.84s\"/><circle cx=\"81.9\" cy=\"544\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:2;animation-duration:3.06s;animation-delay:-1.95s\"/><circle cx=\"89.6\" cy=\"554.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:3;animation-duration:2.22s;animation-delay:-1.47s\"/><circle cx=\"97.4\" cy=\"565\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:4;animation-duration:2.88s;animation-delay:-3.57s\"/><circle cx=\"105.1\" cy=\"575.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:5;animation-duration:2.36s;animation-delay:-4.00s\"/><circle cx=\"112.9\" cy=\"586\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:6;animation-duration:1.60s;animation-delay:-1.26s\"/><circle cx=\"120.6\" cy=\"596.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:7;animation-duration:1.55s;animation-delay:-2.11s\"/><circle cx=\"128.4\" cy=\"607\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:8;animation-duration:2.76s;animation-delay:-1.30s\"/><circle cx=\"136.1\" cy=\"617.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:9;animation-duration:2.66s;animation-delay:-2.07s\"/><circle cx=\"143.9\" cy=\"628\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:10;animation-duration:1.75s;animation-delay:-1.21s\"/><circle cx=\"151.6\" cy=\"638.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:11;animation-duration:2.28s;animation-delay:-3.99s\"/><circle cx=\"159.4\" cy=\"649\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:12;animation-duration:2.41s;animation-delay:-2.68s\"/><circle cx=\"167.1\" cy=\"659.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:13;animation-duration:3.32s;animation-delay:-3.67s\"/><circle cx=\"174.9\" cy=\"670\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:14;animation-duration:2.49s;animation-delay:-1.57s\"/><circle cx=\"182.6\" cy=\"680.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:15;animation-duration:2.51s;animation-delay:-1.79s\"/><circle cx=\"190.4\" cy=\"691\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:16;animation-duration:2.66s;animation-delay:-3.90s\"/><circle cx=\"198.1\" cy=\"701.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:17;animation-duration:3.14s;animation-delay:-1.63s\"/><circle cx=\"205.9\" cy=\"712\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:18;animation-duration:2.76s;animation-delay:-1.61s\"/><circle cx=\"213.6\" cy=\"722.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:19;animation-duration:1.98s;animation-delay:-3.97s\"/><circle cx=\"221.4\" cy=\"733\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:20;animation-duration:3.16s;animation-delay:-0.94s\"/><circle cx=\"229.1\" cy=\"743.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:21;animation-duration:2.88s;animation-delay:-0.42s\"/><circle cx=\"236.9\" cy=\"754\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:22;animation-duration:3.38s;animation-delay:-2.38s\"/><circle cx=\"244.6\" cy=\"764.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:23;animation-duration:2.15s;animation-delay:-1.89s\"/><circle cx=\"252.4\" cy=\"775\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:24;animation-duration:3.41s;animation-delay:-3.92s\"/><circle cx=\"260.1\" cy=\"785.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:25;animation-duration:2.05s;animation-delay:-1.88s\"/><circle cx=\"267.9\" cy=\"796\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:26;animation-duration:2.94s;animation-delay:-3.83s\"/><circle cx=\"275.6\" cy=\"806.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:27;animation-duration:3.50s;animation-delay:-2.70s\"/></g><path d=\"M-9 577.2Q-4.2 575.6 0.6 569.7Q5.4 568.1 10.3 562.2Q15.1 560.6 19.9 554.6Q24.7 553.1 29.5 547.1Q34.3 545.5 39.1 539.6Q43.9 538 48.8 532.1Q53.6 530.5 58.4 524.5Q63.2 523 68 517\" class=\"ef-xmas-wire\"/><g class=\"ef-xmas-glow\"><circle cx=\"-4.2\" cy=\"576.1\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:0;animation-duration:2.84s;animation-delay:-2.95s\"/><circle cx=\"5.4\" cy=\"568.6\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:1;animation-duration:3.18s;animation-delay:-1.07s\"/><circle cx=\"15.1\" cy=\"561.1\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:2;animation-duration:3.14s;animation-delay:-1.75s\"/><circle cx=\"24.7\" cy=\"553.6\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:3;animation-duration:1.44s;animation-delay:-1.48s\"/><circle cx=\"34.3\" cy=\"546\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:4;animation-duration:1.66s;animation-delay:-2.92s\"/><circle cx=\"43.9\" cy=\"538.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:5;animation-duration:2.80s;animation-delay:-1.61s\"/><circle cx=\"53.6\" cy=\"531\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:6;animation-duration:3.20s;animation-delay:-0.43s\"/><circle cx=\"63.2\" cy=\"523.5\" r=\"7.5\" class=\"ef-twinkle\" style=\"--i:7;animation-duration:1.43s;animation-delay:-1.89s\"/></g><g class=\"ef-xmas-bulbs\"><circle cx=\"-4.2\" cy=\"576.1\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:0;animation-duration:2.84s;animation-delay:-2.95s\"/><circle cx=\"5.4\" cy=\"568.6\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:1;animation-duration:3.18s;animation-delay:-1.07s\"/><circle cx=\"15.1\" cy=\"561.1\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:2;animation-duration:3.14s;animation-delay:-1.75s\"/><circle cx=\"24.7\" cy=\"553.6\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:3;animation-duration:1.44s;animation-delay:-1.48s\"/><circle cx=\"34.3\" cy=\"546\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:4;animation-duration:1.66s;animation-delay:-2.92s\"/><circle cx=\"43.9\" cy=\"538.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:5;animation-duration:2.80s;animation-delay:-1.61s\"/><circle cx=\"53.6\" cy=\"531\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:6;animation-duration:3.20s;animation-delay:-0.43s\"/><circle cx=\"63.2\" cy=\"523.5\" r=\"1.7\" class=\"ef-twinkle\" style=\"--i:7;animation-duration:1.43s;animation-delay:-1.89s\"/></g></g>\n<g id=\"ef-solar-drop\" clip-path=\"url(#ef-solar-exit)\">\n<g fill=\"none\" stroke-width=\"13\">\n<path class=\"ef-drop-pipe\" d=\"M561.3 689L563.9 694.4C572.6 712.4 580 728 580 750V873.4\" stroke=\"#4c4c4c\"/>\n<g id=\"ef-f-solar\" class=\"ef-flow\" data-route=\"ef-route-solar\" data-junction-end=\"\" data-flow=\"out\" style=\"--ef-source-color:var(--ef-solar-color,#d6a62c)\">\n  <g>\n    \n    \n    \n    \n    \n    \n    \n    \n    \n    <use class=\"ef-pulse ef-p10\" href=\"#ef-route-solar-eave\"/>\n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    <use class=\"ef-pulse ef-p25\" href=\"#ef-route-solar-eave\"/>\n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    <use class=\"ef-pulse ef-p40\" href=\"#ef-route-solar-eave\"/>\n    \n    \n    \n    \n    \n    \n    \n    \n    \n    \n    <use class=\"ef-pulse ef-p51\" href=\"#ef-route-solar-eave\"/>\n  </g>\n  <g clip-path=\"url(#ef-solar-seam)\">\n    <g class=\"ef-solar-front\" data-junction-shift=\"-63.01\" transform=\"matrix(0 1 1 -0.21469 580 750)\">\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p10\" href=\"#ef-route-solar-front\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p25\" href=\"#ef-route-solar-front\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p40\" href=\"#ef-route-solar-front\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p51\" href=\"#ef-route-solar-front\"/>\n    </g>\n    <g class=\"ef-solar-side\" data-junction-shift=\"-62.59\" transform=\"matrix(0 1 1 0.35106 580 750)\">\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p10\" href=\"#ef-route-solar-side\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p25\" href=\"#ef-route-solar-side\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p40\" href=\"#ef-route-solar-side\"/>\n      \n      \n      \n      \n      \n      \n      \n      \n      \n      \n      <use class=\"ef-pulse ef-p51\" href=\"#ef-route-solar-side\"/>\n    </g>\n  </g>\n</g>\n<path d=\"M561.3 689L563.9 694.4C572.6 712.4 580 728 580 750V873.4\" transform=\"translate(-4.4 .9)\" stroke=\"#000\" stroke-opacity=\".3\" stroke-width=\"4.2\"/>\n</g>\n</g>\n<g class=\"ef-bake\">\n<use id=\"ef-front-pv\" href=\"#ef-pv-array\"/>\n<g clip-path=\"url(#ef-pv-glass)\"><use href=\"#ef-sun-shine\"/><use href=\"#ef-moon-shine\"/></g>\n<use href=\"#ef-pv-weather\"/>\n</g>\n<path d=\"M562.5 827.3 569 829.5 569 905.5 562.5 903.3Z\" fill=\"url(#ef-meter-side)\"/>\n<path d=\"M562.5 827.3 590.5 821.3 597 823.5 569 829.5Z\" fill=\"#6d6d6f\"/>\n<g class=\"ef-snowcap\"><path d=\"M562.5 827.3L562.5 827.3 563.5 825.5 564.5 824.1 565.5 823.8 566.4 823.6 567.4 823.4 568.4 823.2 569.4 823.1 570.4 822.9 571.4 822.7 572.4 822.7 573.3 822.8 574.3 822.9 575.3 822.9 576.3 822.7 577.3 822.6 578.3 822.4 579.3 822.2 580.2 822 581.2 821.8 582.2 821.5 583.2 821.2 584.2 821 585.2 820.8 586.2 820.5 587.1 820.3 588.1 820 589.1 819.8 590.1 819.4 591.1 818.9 592.1 818.5 593.1 818.3 594 818.2 595 818.1 596 819.2 597 820.5L597 820.5Z\"/></g>\n<path d=\"M569 829.5 597 823.5 597 899.5 569 905.5Z\" fill=\"url(#ef-meter-face)\"/>\n<path d=\"M569.6 830.6 596.4 824.8M569.6 830.6V904.6\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".16\" stroke-width=\".9\"/>\n<path d=\"M569.4 849.2 596.6 843.4\" fill=\"none\" stroke=\"#2c2c2e\" stroke-width=\"1\"/>\n<path d=\"M569.4 850.2 596.6 844.4\" fill=\"none\" stroke=\"#fff\" stroke-opacity=\".09\" stroke-width=\".8\"/>\n<g transform=\"translate(583 888.7) matrix(1 -.2143 0 1 0 0)\">\n  <circle r=\"7.6\" fill=\"#2d2d2f\"/>\n  <circle r=\"6.6\" fill=\"url(#ef-meter-bezel)\"/>\n  <circle r=\"5\" fill=\"url(#ef-meter-glass)\"/>\n  <ellipse cx=\"-1.6\" cy=\"-1.9\" rx=\"2.4\" ry=\"1.3\" fill=\"#fff\" opacity=\".55\" transform=\"rotate(-30 -1.6 -1.9)\"/>\n</g>\n<g class=\"ef-light-only\">\n  <ellipse id=\"ef-b1-glow\" cx=\"338\" cy=\"985\" rx=\"30\" ry=\"96\" fill=\"url(#ef-strip-spill)\"/>\n  <ellipse id=\"ef-b2-glow\" cx=\"449\" cy=\"984\" rx=\"22\" ry=\"74\" fill=\"url(#ef-strip-spill-b2)\"/>\n</g>\n<g class=\"ef-light-only\" filter=\"url(#ef-ao-blur)\">\n  <path id=\"ef-b1-ao\" d=\"M342 1063.5 424 1047.5\" fill=\"none\" stroke=\"#222531\" stroke-opacity=\".50\" stroke-width=\"5.5\"/>\n  <path id=\"ef-b2-ao\" d=\"M454 1038.5 530 1023\" fill=\"none\" stroke=\"#222531\" stroke-opacity=\".46\" stroke-width=\"5\"/>\n</g>\n<g class=\"ef-light-only\" filter=\"url(#ef-rim-shadow)\">\n  <path class=\"ef-b1-contact\" d=\"M332 899 399 882 416 1049 333 1062Z\" transform=\"translate(-3.5 2)\" fill=\"#343647\" opacity=\".12\" filter=\"url(#ef-wall-shadow)\"/>\n  <path class=\"ef-b2-contact\" d=\"M446 891 515 877 524 1023 446 1038Z\" transform=\"translate(-3 2)\" fill=\"#282a38\" opacity=\".12\" filter=\"url(#ef-wall-shadow)\"/>\n  <path id=\"ef-b1-wall-shadow\" d=\"M335 895 420 879 423 1049 336 1063Z\" fill=\"#23252f\" opacity=\".30\" transform=\"translate(-3.8 2)\"/>\n  <path id=\"ef-b2-wall-shadow\" d=\"M446 889 527 874 530 1024 446 1039Z\" fill=\"#20222a\" opacity=\".32\" transform=\"translate(-3 2)\"/>\n</g>\n<g class=\"ef-light-only\" fill=\"none\" stroke=\"#10121c\" filter=\"url(#ef-contact-shadow)\" transform=\"translate(-1 1.6)\">\n  <path class=\"ef-b1-contact\" d=\"M343 1061.5 351 1064.5 423.5 1048.5\" stroke-width=\"3.6\" opacity=\".82\"/>\n  <path class=\"ef-b2-contact\" d=\"M453 1036.5 461 1039.5 529.5 1024.5\" stroke-width=\"3.4\" opacity=\".82\"/>\n</g>\n<g class=\"ef-light-only\" fill=\"none\" stroke=\"#0b0d14\" filter=\"url(#ef-contact-shadow)\">\n  <path class=\"ef-b1-contact\" d=\"M338 1059.5 350.5 1064.5 423.5 1048.8\" stroke-width=\"2.4\" opacity=\".92\"/>\n  <path class=\"ef-b2-contact\" d=\"M448.5 1034.5 461 1039.5 529.5 1024.8\" stroke-width=\"2.4\" opacity=\".90\"/>\n</g>\n<g id=\"ef-b1-battery\">\n<path d=\"M335 897Q335 894 337.9 893.4L406.1 879.1Q409 878.5 411.7 879.8L417.8 882.7Q420.5 884 420.5 887L420.5 1045Q420.5 1048 417.6 1048.7L352.9 1063.3Q350 1064 347.2 1063L338.8 1060Q336 1059 336 1056Z\" fill=\"url(#ef-b1-body)\"/>\n<polygon id=\"ef-b1-level\" data-full=\"338,1055.7 346.5,1058.8 346.5,902.1 338,899.1\" points=\"338,1055.7 346.5,1058.8 346.5,958.5 338.0,955.5\" fill=\"url(#ef-b1-strip)\"/>\n<path d=\"M352 898.4 420 884.1Q423 883.5 423 886.5L423.5 1044.5Q423.5 1047.5 420.6 1048.2L353 1063.3Q350 1064 350 1061L349 902Q349 899 352 898.4Z\" fill=\"url(#ef-b1-face)\"/>\n<path d=\"M356.5 898 420 884.1Q423 883.5 423 886.5L423.4 1040Z\" fill=\"#fff\" opacity=\".28\"/>\n<g class=\"ef-snowcap\"><path d=\"M336 894L336 894 338.1 891.8 340.2 890.2 342.3 889.9 344.3 889.6 346.4 889.2 348.5 888.7 350.6 888.2 352.7 887.7 354.8 887.3 356.9 887 358.9 886.7 361 886.5 363.1 886.1 365.2 885.6 367.3 884.9 369.4 884.1 371.5 883.4 373.5 882.9 375.6 882.7 377.7 882.5 379.8 882.2 381.9 881.9 384 881.5 386.1 881.2 388.1 880.9 390.2 880.5 392.3 880.1 394.4 879.4 396.5 878.7 398.6 878 400.7 877.5 402.7 877.2 404.8 876.8 406.9 877.5 409 878.5L409 878.5Z\"/><path d=\"M349 899.5L349 899.5 351.1 897.6 353.2 895.9 355.3 895.3 357.5 894.7 359.6 894.2 361.7 893.6 363.8 892.8 365.9 892.2 368 891.7 370.1 891.4 372.3 891.3 374.4 891.2 376.5 891 378.6 890.6 380.7 890.2 382.8 890 384.9 889.6 387.1 889.2 389.2 888.4 391.3 887.5 393.4 886.7 395.5 886.1 397.6 885.6 399.7 885.2 401.9 884.8 404 884.3 406.1 883.9 408.2 883.5 410.3 883.1 412.4 882.8 414.5 882.3 416.7 882.1 418.8 882 420.9 883 423 884L423 884Z\"/></g>\n</g>\n<g id=\"ef-b2-battery\">\n<path d=\"M447 890.9Q447 887.9 449.9 887.3L512.1 873.9Q515 873.3 517.7 874.6L523.8 877.5Q526.5 878.8 526.5 881.8L526.5 1021Q526.5 1024 523.6 1024.7L463.9 1038.3Q461 1039 458.2 1038L449.8 1035Q447 1034 447 1031Z\" fill=\"url(#ef-b2-body)\"/>\n<polygon id=\"ef-b2-level\" data-full=\"450,1031.1 458,1033.9 458,895.8 450,893\" points=\"450,1031.1 458,1033.9 458.0,967.6 450.0,964.8\" fill=\"url(#ef-b2-strip)\"/>\n<path d=\"M461 895.9Q461 892.9 463.9 892.3L526.1 878.9Q529 878.3 529 881.3L529 1020.8Q529 1023.8 526.1 1024.4L463.9 1038.3Q461 1039 461 1036Z\" fill=\"url(#ef-b2-face)\"/>\n<path d=\"M469 891.2L529 879.4L529 1015.8Z\" fill=\"#fff\" opacity=\".065\"/>\n<g class=\"ef-snowcap\"><path d=\"M447 888L447 888 448.9 886.3 450.9 885 452.8 884.6 454.8 884.2 456.7 883.7 458.7 883.3 460.6 882.8 462.5 882.4 464.5 881.9 466.4 881.3 468.4 880.5 470.3 879.8 472.3 879.2 474.2 878.8 476.1 878.5 478.1 878.2 480 877.9 482 877.5 483.9 877.1 485.9 876.8 487.8 876.4 489.7 876 491.7 875.6 493.6 875.3 495.6 875 497.5 874.6 499.5 874.2 501.4 873.7 503.3 873.2 505.3 872.8 507.2 872.3 509.2 871.9 511.1 871.6 513.1 872.3 515 873.3L515 873.3Z\"/><path d=\"M461 894.5L461 894.5 462.9 892.2 464.9 890.8 466.8 890.9 468.8 890.8 470.7 890.3 472.7 889.5 474.6 888.6 476.5 887.7 478.5 887.2 480.4 886.8 482.4 886.4 484.3 886 486.3 885.6 488.2 885.3 490.1 885.3 492.1 885.4 494 885.4 496 885 497.9 884.2 499.9 883.2 501.8 882.4 503.7 881.8 505.7 881.5 507.6 881.3 509.6 881.1 511.5 880.8 513.5 880.3 515.4 879.8 517.3 879.3 519.3 878.9 521.2 878.4 523.2 878.3 525.1 878.3 527.1 879.2 529 880L529 880Z\"/></g>\n</g>\n<clipPath id=\"ef-b1-line-span\"><rect x=\"423.5\" y=\"780\" width=\"139\" height=\"160\"/></clipPath>\n<g clip-path=\"url(#ef-b1-line-span)\">\n  <g id=\"ef-l-b1\" class=\"ef-line\">\n    <use href=\"#ef-rail-b1\" class=\"ef-lane\"/>\n    <use href=\"#ef-rail-b1\" class=\"ef-pipe-shade\"/>\n    <g id=\"ef-f-b1\" transform=\"matrix(1 -.215 0 1 0 0)\" class=\"ef-flow\" data-route=\"ef-route-b1\" data-junction-end=\"\" data-flow=\"out\" style=\"--ef-source-color:var(--ef-b1-color,#4dbd80)\">\n      <g class=\"ef-front\" transform=\"translate(0 1.1)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-b1\"/>\n      </g>\n      <g class=\"ef-top\" transform=\"translate(0 976.13) matrix(1 0 1.76 1 0 0) translate(0 -981.53)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-b1\"/>\n      </g>\n    </g>\n    <g id=\"ef-f-b1-2\" transform=\"matrix(1 -.215 0 1 0 0)\" class=\"ef-flow\" data-route=\"ef-route-b1\" data-junction-end=\"\" data-flow=\"out\" style=\"--ef-source-color:var(--ef-b1-color,#4dbd80)\">\n      <g class=\"ef-front\" transform=\"translate(0 1.1)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-b1\"/>\n      </g>\n      <g class=\"ef-top\" transform=\"translate(0 976.13) matrix(1 0 1.76 1 0 0) translate(0 -981.53)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-b1\"/>\n      </g>\n    </g>\n    <g id=\"ef-f-b1-3\" transform=\"matrix(1 -.215 0 1 0 0)\" class=\"ef-flow\" data-route=\"ef-route-b1\" data-junction-end=\"\" data-flow=\"out\" style=\"--ef-source-color:var(--ef-b1-color,#4dbd80)\">\n      <g class=\"ef-front\" transform=\"translate(0 1.1)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-b1\"/>\n      </g>\n      <g class=\"ef-top\" transform=\"translate(0 976.13) matrix(1 0 1.76 1 0 0) translate(0 -981.53)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-b1\"/>\n      </g>\n    </g>\n    <g id=\"ef-f-b1-4\" transform=\"matrix(1 -.215 0 1 0 0)\" class=\"ef-flow\" data-route=\"ef-route-b1\" data-junction-end=\"\" data-flow=\"out\" style=\"--ef-source-color:var(--ef-b1-color,#4dbd80)\">\n      <g class=\"ef-front\" transform=\"translate(0 1.1)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-b1\"/>\n      </g>\n      <g class=\"ef-top\" transform=\"translate(0 976.13) matrix(1 0 1.76 1 0 0) translate(0 -981.53)\">\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p10\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p25\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p40\" href=\"#ef-route-b1\"/>\n        \n        \n        \n        \n        \n        \n        \n        \n        \n        \n        <use class=\"ef-pulse ef-p51\" href=\"#ef-route-b1\"/>\n      </g>\n    </g>\n  </g>\n</g>\n<g id=\"ef-window-reflection\" class=\"ef-reflection\">\n<path d=\"M771 1190 836.5 1175.9175 836.5 1119.6175 771 1133.7ZM852.5 1172.4775 917.5 1158.5025 917.5 1102.2025 852.5 1116.1775ZM771 1118.7 836.5 1104.6175 836.5 1048.4175 771 1062.5ZM852.5 1101.1775 917.5 1087.2025 917.5 1031.0025 852.5 1044.9775Z\" fill=\"url(#ef-window-dark-a)\" filter=\"url(#ef-pane-mirror-a)\"/>\n<path d=\"M771 1190 836.5 1175.9175 836.5 1119.6175 771 1133.7ZM852.5 1172.4775 917.5 1158.5025 917.5 1102.2025 852.5 1116.1775ZM771 1118.7 836.5 1104.6175 836.5 1048.4175 771 1062.5ZM852.5 1101.1775 917.5 1087.2025 917.5 1031.0025 852.5 1044.9775Z\" fill=\"url(#ef-window-dark-b)\" filter=\"url(#ef-pane-mirror-b)\"/>\n<path d=\"M771 1190 836.5 1175.9175 836.5 1119.6175 771 1133.7ZM852.5 1172.4775 917.5 1158.5025 917.5 1102.2025 852.5 1116.1775ZM771 1118.7 836.5 1104.6175 836.5 1048.4175 771 1062.5ZM852.5 1101.1775 917.5 1087.2025 917.5 1031.0025 852.5 1044.9775Z\" fill=\"url(#ef-window-dark-c)\" filter=\"url(#ef-pane-mirror-c)\"/>\n</g>\n<clipPath id=\"ef-b1-floor\"><path d=\"M295 1048 336 1061 350 1066 424 1050 470 1040V1285H295Z\"/></clipPath>\n<linearGradient id=\"ef-b1-reflection-fade\" gradientUnits=\"userSpaceOnUse\" x1=\"386\" y1=\"1055.9\" x2=\"408\" y2=\"1158\"><stop offset=\"0\" stop-color=\"#fff\"/><stop offset=\".38\" stop-color=\"#fff\" stop-opacity=\".42\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/></linearGradient>\n<mask id=\"ef-b1-reflection-mask\" maskUnits=\"userSpaceOnUse\" x=\"300\" y=\"1020\" width=\"170\" height=\"260\"><rect x=\"300\" y=\"1020\" width=\"170\" height=\"260\" fill=\"url(#ef-b1-reflection-fade)\"/></mask>\n<g id=\"ef-b1-reflection\" class=\"ef-reflection\" mask=\"url(#ef-b1-reflection-mask)\"><g filter=\"url(#ef-reflection-blur)\">\n  <path d=\"M352 898.4 420 884.1Q423 883.5 423 886.5L423.5 1044.5Q423.5 1047.5 420.6 1048.2L353 1063.3Q350 1064 350 1061L349 902Q349 899 352 898.4Z\" style=\"fill:var(--ef-b1-mirror,#e2e2e2)\" transform=\"matrix(1 -0.4467 0 -1 0 2284.30)\"/>\n  <use href=\"#ef-b1-level\" transform=\"matrix(1 0.7143 0 -1 0 1878.00)\"/>\n</g>\n  <g class=\"ef-light-only\" opacity=\".52\" filter=\"url(#ef-led-bloom)\"><use href=\"#ef-b1-level\" transform=\"matrix(1 0.7143 0 -1 0 1878.00)\"/></g>\n  <g class=\"ef-light-only\" opacity=\".76\" filter=\"url(#ef-led-reflection)\"><use href=\"#ef-b1-level\" transform=\"matrix(1 0.7143 0 -1 0 1878.00)\"/></g>\n</g>\n<clipPath id=\"ef-b2-floor\"><path d=\"M410 1023 447 1036 461 1041 530 1026 580 1016V1260H410Z\"/></clipPath>\n<linearGradient id=\"ef-b2-reflection-fade\" gradientUnits=\"userSpaceOnUse\" x1=\"495\" y1=\"1031.3\" x2=\"518\" y2=\"1142\"><stop offset=\"0\" stop-color=\"#fff\"/><stop offset=\".42\" stop-color=\"#fff\" stop-opacity=\".46\"/><stop offset=\"1\" stop-color=\"#fff\" stop-opacity=\"0\"/></linearGradient>\n<mask id=\"ef-b2-reflection-mask\" maskUnits=\"userSpaceOnUse\" x=\"410\" y=\"1000\" width=\"160\" height=\"250\"><rect x=\"410\" y=\"1000\" width=\"160\" height=\"250\" fill=\"url(#ef-b2-reflection-fade)\"/></mask>\n<g id=\"ef-b2-reflection\" class=\"ef-reflection\" mask=\"url(#ef-b2-reflection-mask)\"><g filter=\"url(#ef-reflection-blur)\">\n  <path d=\"M461 895.9Q461 892.9 463.9 892.3L526.1 878.9Q529 878.3 529 881.3L529 1020.8Q529 1023.8 526.1 1024.4L463.9 1038.3Q461 1039 461 1036Z\" style=\"fill:var(--ef-b2-mirror,#6d7179)\" transform=\"matrix(1 -0.4469 0 -1 0 2283.94)\"/>\n  <use href=\"#ef-b2-level\" transform=\"matrix(1 0.7143 0 -1 0 1748.71)\"/>\n</g>\n  <g class=\"ef-light-only\" opacity=\".52\" filter=\"url(#ef-led-bloom)\"><use href=\"#ef-b2-level\" transform=\"matrix(1 0.7143 0 -1 0 1748.71)\"/></g>\n  <g class=\"ef-light-only\" opacity=\".76\" filter=\"url(#ef-led-reflection)\"><use href=\"#ef-b2-level\" transform=\"matrix(1 0.7143 0 -1 0 1748.71)\"/></g>\n</g>\n<g class=\"ef-light-only\">\n  <g clip-path=\"url(#ef-floor-plane)\">\n  <ellipse id=\"ef-window-spill\" cx=\"860\" cy=\"978\" rx=\"126\" ry=\"54\" transform=\"rotate(-14 860 978)\" fill=\"url(#ef-window-spill-g)\"/>\n  <ellipse id=\"ef-b1-spill\" cx=\"342\" cy=\"1076\" rx=\"22\" ry=\"30\" fill=\"url(#ef-strip-spill)\"/>\n  <ellipse id=\"ef-b2-spill\" cx=\"454\" cy=\"1050\" rx=\"20\" ry=\"28\" fill=\"url(#ef-strip-spill-b2)\"/>\n  </g>\n</g>\n<g id=\"ef-fog\"><ellipse cx=\"420\" cy=\"640\" rx=\"1000\" ry=\"260\" fill=\"url(#ef-c5)\" opacity=\".5\"/><ellipse cx=\"800\" cy=\"900\" rx=\"1050\" ry=\"280\" fill=\"url(#ef-c5)\" opacity=\".4\"/></g>\n<g id=\"ef-rain\" fill=\"none\" stroke=\"#fff\">\n<g class=\"ef-streaks\" stroke-width=\"1.6\" stroke-linecap=\"round\" opacity=\".16\"><path d=\"M337.5 -60v27\" style=\"animation-duration:1.16s;animation-delay:-0.15s\"/><path d=\"M763.5 -60v19\" style=\"animation-duration:1.08s;animation-delay:-0.13s\"/><path d=\"M174 -60v18\" style=\"animation-duration:1.33s;animation-delay:-0.29s\"/><path d=\"M222 -60v32\" style=\"animation-duration:1.04s;animation-delay:-0.32s\"/><path d=\"M86.5 -60v13\" style=\"animation-duration:1.27s;animation-delay:-0.44s\"/><path d=\"M825 -60v19\" style=\"animation-duration:1.18s;animation-delay:-0.32s\"/><path d=\"M1037 -60v26\" style=\"animation-duration:1.03s;animation-delay:-0.27s\"/><path d=\"M1036 -60v33\" style=\"animation-duration:1.25s;animation-delay:-0.43s\"/><path d=\"M951 -60v16\" style=\"animation-duration:1.02s;animation-delay:-0.37s\"/><path d=\"M916 -60v15\" style=\"animation-duration:1.22s;animation-delay:-0.46s\"/><path d=\"M903.5 -60v24\" style=\"animation-duration:1.03s;animation-delay:-0.42s\"/><path d=\"M1010 -60v26\" style=\"animation-duration:1.05s;animation-delay:-0.61s\"/><path d=\"M1055 -60v38\" style=\"animation-duration:1.21s;animation-delay:-0.72s\"/><path d=\"M925 -60v26\" style=\"animation-duration:1.41s;animation-delay:-0.81s\"/><path d=\"M754 -60v19\" style=\"animation-duration:1.06s;animation-delay:-0.59s\"/><path d=\"M622.5 -60v18\" style=\"animation-duration:1.11s;animation-delay:-0.57s\"/><path d=\"M688 -60v16\" style=\"animation-duration:1.31s;animation-delay:-0.67s\"/><path d=\"M141 -60v36\" style=\"animation-duration:1.47s;animation-delay:-0.81s\"/><path d=\"M673.7 -60v35.5\" style=\"animation-duration:1.02s;animation-delay:-0.40s\"/><path d=\"M997.2 -60v17.2\" style=\"animation-duration:1.06s;animation-delay:-0.30s\"/><path d=\"M364.8 -60v18\" style=\"animation-duration:1.29s;animation-delay:-1.01s\"/><path d=\"M744.8 -60v26.1\" style=\"animation-duration:1.03s;animation-delay:-0.38s\"/><path d=\"M78.5 -60v29\" style=\"animation-duration:1.21s;animation-delay:-0.25s\"/><path d=\"M371.3 -60v24\" style=\"animation-duration:1.15s;animation-delay:-0.65s\"/><path d=\"M923.5 -60v19.4\" style=\"animation-duration:1.29s;animation-delay:-0.87s\"/><path d=\"M614 -60v30\" style=\"animation-duration:1.14s;animation-delay:-0.96s\"/><path d=\"M1137.2 -60v23.2\" style=\"animation-duration:1.38s;animation-delay:-0.17s\"/><path d=\"M184.8 -60v14.9\" style=\"animation-duration:1.33s;animation-delay:-0.64s\"/><path d=\"M889.3 -60v33.3\" style=\"animation-duration:1.16s;animation-delay:-0.64s\"/><path d=\"M809.6 -60v26.8\" style=\"animation-duration:1.23s;animation-delay:-0.71s\"/></g>\n<g id=\"ef-heavy\" class=\"ef-streaks\" stroke-width=\"1.8\" stroke-linecap=\"round\" opacity=\".2\"><path d=\"M982.8 -60v37.3\" style=\"animation-duration:0.90s;animation-delay:-0.82s\"/><path d=\"M71 -60v42.1\" style=\"animation-duration:1.00s;animation-delay:-0.68s\"/><path d=\"M961.7 -60v34.8\" style=\"animation-duration:0.90s;animation-delay:-0.25s\"/><path d=\"M26.4 -60v28.7\" style=\"animation-duration:0.74s;animation-delay:-0.33s\"/><path d=\"M69 -60v27.6\" style=\"animation-duration:0.77s;animation-delay:-0.57s\"/><path d=\"M457.4 -60v26.3\" style=\"animation-duration:0.83s;animation-delay:-0.70s\"/><path d=\"M642.8 -60v46.9\" style=\"animation-duration:0.96s;animation-delay:-0.82s\"/><path d=\"M325.8 -60v34\" style=\"animation-duration:0.97s;animation-delay:-0.39s\"/><path d=\"M1120.5 -60v28.9\" style=\"animation-duration:0.77s;animation-delay:-0.12s\"/><path d=\"M273 -60v40.5\" style=\"animation-duration:0.78s;animation-delay:-0.37s\"/><path d=\"M4.8 -60v34.3\" style=\"animation-duration:0.87s;animation-delay:-0.36s\"/><path d=\"M1115.1 -60v38.4\" style=\"animation-duration:0.89s;animation-delay:-0.59s\"/><path d=\"M791.2 -60v49.2\" style=\"animation-duration:0.93s;animation-delay:-0.06s\"/><path d=\"M1023.2 -60v35\" style=\"animation-duration:0.82s;animation-delay:-0.63s\"/><path d=\"M121.1 -60v25.7\" style=\"animation-duration:0.72s;animation-delay:-0.44s\"/><path d=\"M244.3 -60v33.5\" style=\"animation-duration:0.72s;animation-delay:-0.12s\"/><path d=\"M0.3 -60v26.8\" style=\"animation-duration:0.81s;animation-delay:-0.13s\"/><path d=\"M29.8 -60v41.2\" style=\"animation-duration:0.74s;animation-delay:-0.63s\"/><path d=\"M295.1 -60v34.2\" style=\"animation-duration:0.74s;animation-delay:-0.25s\"/><path d=\"M993.3 -60v37\" style=\"animation-duration:0.85s;animation-delay:-0.81s\"/><path d=\"M100.5 -60v33.6\" style=\"animation-duration:0.78s;animation-delay:-0.09s\"/><path d=\"M969.8 -60v24.6\" style=\"animation-duration:0.99s;animation-delay:-0.16s\"/><path d=\"M618.1 -60v39.2\" style=\"animation-duration:0.71s;animation-delay:-0.11s\"/><path d=\"M617.9 -60v48.2\" style=\"animation-duration:0.91s;animation-delay:-0.85s\"/><path d=\"M305.5 -60v28.7\" style=\"animation-duration:0.93s;animation-delay:-0.34s\"/><path d=\"M623.1 -60v33.2\" style=\"animation-duration:0.77s;animation-delay:-0.58s\"/><path d=\"M949.5 -60v47.9\" style=\"animation-duration:0.94s;animation-delay:-0.89s\"/><path d=\"M957.4 -60v30.3\" style=\"animation-duration:0.86s;animation-delay:-0.61s\"/><path d=\"M416 -60v24.8\" style=\"animation-duration:0.78s;animation-delay:-0.03s\"/><path d=\"M303.2 -60v50.8\" style=\"animation-duration:0.83s;animation-delay:-0.56s\"/><path d=\"M1096.3 -60v50.7\" style=\"animation-duration:0.81s;animation-delay:-0.77s\"/><path d=\"M257.9 -60v29.5\" style=\"animation-duration:0.76s;animation-delay:-0.17s\"/><path d=\"M730.2 -60v47.5\" style=\"animation-duration:0.84s;animation-delay:-0.73s\"/><path d=\"M764 -60v26.4\" style=\"animation-duration:0.90s;animation-delay:-0.69s\"/><path d=\"M1064.4 -60v45\" style=\"animation-duration:0.84s;animation-delay:-0.64s\"/><path d=\"M208.9 -60v33.3\" style=\"animation-duration:0.94s;animation-delay:-0.72s\"/><path d=\"M1136.8 -60v35.2\" style=\"animation-duration:0.98s;animation-delay:-0.38s\"/><path d=\"M848 -60v27.6\" style=\"animation-duration:0.75s;animation-delay:-0.13s\"/><path d=\"M1058.7 -60v28.1\" style=\"animation-duration:0.95s;animation-delay:-0.74s\"/><path d=\"M1147 -60v33.8\" style=\"animation-duration:0.86s;animation-delay:-0.55s\"/><path d=\"M153.3 -60v51.2\" style=\"animation-duration:0.89s;animation-delay:-0.02s\"/><path d=\"M616.1 -60v36.1\" style=\"animation-duration:0.96s;animation-delay:-0.86s\"/><path d=\"M966.6 -60v31.1\" style=\"animation-duration:0.79s;animation-delay:-0.17s\"/><path d=\"M281.4 -60v31.3\" style=\"animation-duration:0.83s;animation-delay:-0.47s\"/><path d=\"M153.4 -60v33.9\" style=\"animation-duration:0.84s;animation-delay:-0.73s\"/><path d=\"M682.5 -60v35.8\" style=\"animation-duration:0.98s;animation-delay:-0.85s\"/></g>\n<g id=\"ef-ripples\" stroke-width=\"1\"><ellipse cx=\"145\" cy=\"273\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:2.10s;animation-delay:-1.12s\"/><ellipse cx=\"204\" cy=\"305\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:2.13s;animation-delay:-0.04s\"/><ellipse cx=\"321\" cy=\"349\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:2.03s;animation-delay:-0.37s\"/><ellipse cx=\"39\" cy=\"388\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:1.50s;animation-delay:-1.20s\"/><ellipse cx=\"411\" cy=\"262\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:1.71s;animation-delay:-0.81s\"/><ellipse cx=\"450\" cy=\"451\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:2.37s;animation-delay:-1.32s\"/><ellipse cx=\"418\" cy=\"659\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:1.89s;animation-delay:-0.98s\"/><ellipse cx=\"482\" cy=\"554\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:2.17s;animation-delay:-1.70s\"/><ellipse cx=\"716\" cy=\"553\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:1.63s;animation-delay:-0.91s\"/><ellipse cx=\"557\" cy=\"507\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:1.80s;animation-delay:-0.50s\"/><ellipse cx=\"807\" cy=\"1168\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:2.43s;animation-delay:-1.23s\"/><ellipse cx=\"899\" cy=\"935\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:2.17s;animation-delay:-1.65s\"/><ellipse cx=\"799\" cy=\"973\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:2.59s;animation-delay:-1.15s\"/><ellipse cx=\"700\" cy=\"1262\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:2.24s;animation-delay:-1.13s\"/><ellipse cx=\"236\" cy=\"1296\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:2.11s;animation-delay:-1.46s\"/><ellipse cx=\"1050\" cy=\"1190\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:2.04s;animation-delay:-1.09s\"/><ellipse cx=\"962\" cy=\"1330\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:2.07s;animation-delay:-1.95s\"/><ellipse cx=\"640\" cy=\"470\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:2.34s;animation-delay:-2.05s\"/><ellipse cx=\"300\" cy=\"600\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:2.63s;animation-delay:-0.68s\"/><ellipse cx=\"820\" cy=\"600\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:2.17s;animation-delay:-2.05s\"/><ellipse cx=\"90\" cy=\"1120\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:2.51s;animation-delay:-0.34s\"/><ellipse cx=\"1100\" cy=\"1040\" rx=\"6\" ry=\"2.3\" style=\"animation-duration:1.65s;animation-delay:-0.73s\"/></g>\n</g>\n<g id=\"ef-snow\" fill=\"#fff\"><circle class=\"ef-sa\" cx=\"484\" cy=\"-20\" r=\"2.5\" opacity=\"0.59\" style=\"animation-duration:7.4s;animation-delay:-0.9s\"/><circle class=\"ef-sb\" cx=\"121.6\" cy=\"-20\" r=\"3.9\" opacity=\"0.89\" style=\"animation-duration:11.7s;animation-delay:-2.6s\"/><circle class=\"ef-sb\" cx=\"1063.9\" cy=\"-20\" r=\"2.4\" opacity=\"0.75\" style=\"animation-duration:12.7s;animation-delay:-2.8s\"/><circle class=\"ef-sb\" cx=\"370.7\" cy=\"-20\" r=\"2.4\" opacity=\"0.59\" style=\"animation-duration:11.2s;animation-delay:-8.1s\"/><circle class=\"ef-sb\" cx=\"499.4\" cy=\"-20\" r=\"2.0\" opacity=\"0.60\" style=\"animation-duration:7.1s;animation-delay:-4.4s\"/><circle class=\"ef-sa\" cx=\"83.3\" cy=\"-20\" r=\"4.0\" opacity=\"0.55\" style=\"animation-duration:10.1s;animation-delay:-8.8s\"/><circle class=\"ef-sb\" cx=\"-9.7\" cy=\"-20\" r=\"3.7\" opacity=\"0.57\" style=\"animation-duration:7.5s;animation-delay:-1.0s\"/><circle class=\"ef-sb\" cx=\"455.6\" cy=\"-20\" r=\"3.2\" opacity=\"0.68\" style=\"animation-duration:9.5s;animation-delay:-4.7s\"/><circle class=\"ef-sb\" cx=\"13.1\" cy=\"-20\" r=\"3.5\" opacity=\"0.64\" style=\"animation-duration:9.0s;animation-delay:-0.6s\"/><circle class=\"ef-sa\" cx=\"958.1\" cy=\"-20\" r=\"2.2\" opacity=\"0.84\" style=\"animation-duration:12.6s;animation-delay:-0.8s\"/><circle class=\"ef-sb\" cx=\"-45.3\" cy=\"-20\" r=\"4.2\" opacity=\"0.64\" style=\"animation-duration:12.2s;animation-delay:-11.1s\"/><circle class=\"ef-sa\" cx=\"609.2\" cy=\"-20\" r=\"2.5\" opacity=\"0.50\" style=\"animation-duration:10.7s;animation-delay:-1.7s\"/><circle class=\"ef-sa\" cx=\"1124\" cy=\"-20\" r=\"3.4\" opacity=\"0.69\" style=\"animation-duration:7.3s;animation-delay:-1.5s\"/><circle class=\"ef-sa\" cx=\"283.6\" cy=\"-20\" r=\"3.8\" opacity=\"0.90\" style=\"animation-duration:9.7s;animation-delay:-0.4s\"/><circle class=\"ef-sa\" cx=\"593.1\" cy=\"-20\" r=\"2.5\" opacity=\"0.65\" style=\"animation-duration:7.1s;animation-delay:-4.7s\"/><circle class=\"ef-sb\" cx=\"633.3\" cy=\"-20\" r=\"4.0\" opacity=\"0.89\" style=\"animation-duration:10.9s;animation-delay:-3.4s\"/><circle class=\"ef-sa\" cx=\"375.2\" cy=\"-20\" r=\"3.8\" opacity=\"0.77\" style=\"animation-duration:8.3s;animation-delay:-5.3s\"/><circle class=\"ef-sb\" cx=\"1187\" cy=\"-20\" r=\"3.8\" opacity=\"0.46\" style=\"animation-duration:9.4s;animation-delay:-5.9s\"/><circle class=\"ef-sb\" cx=\"147.3\" cy=\"-20\" r=\"2.2\" opacity=\"0.83\" style=\"animation-duration:12.3s;animation-delay:-10.7s\"/><circle class=\"ef-sb\" cx=\"700.4\" cy=\"-20\" r=\"3.5\" opacity=\"0.47\" style=\"animation-duration:11.0s;animation-delay:-2.0s\"/><circle class=\"ef-sa\" cx=\"274.3\" cy=\"-20\" r=\"4.1\" opacity=\"0.89\" style=\"animation-duration:8.6s;animation-delay:-4.7s\"/><circle class=\"ef-sb\" cx=\"216.7\" cy=\"-20\" r=\"2.4\" opacity=\"0.60\" style=\"animation-duration:8.5s;animation-delay:-0.7s\"/><circle class=\"ef-sa\" cx=\"255.2\" cy=\"-20\" r=\"3.7\" opacity=\"0.49\" style=\"animation-duration:8.7s;animation-delay:-7.1s\"/><circle class=\"ef-sa\" cx=\"440.4\" cy=\"-20\" r=\"2.7\" opacity=\"0.73\" style=\"animation-duration:7.9s;animation-delay:-0.7s\"/><circle class=\"ef-sa\" cx=\"775.1\" cy=\"-20\" r=\"3.6\" opacity=\"0.85\" style=\"animation-duration:12.7s;animation-delay:-5.0s\"/><circle class=\"ef-sb\" cx=\"129.8\" cy=\"-20\" r=\"3.6\" opacity=\"0.74\" style=\"animation-duration:9.0s;animation-delay:-0.4s\"/><circle class=\"ef-sb\" cx=\"872\" cy=\"-20\" r=\"3.8\" opacity=\"0.51\" style=\"animation-duration:12.0s;animation-delay:-6.3s\"/><circle class=\"ef-sa\" cx=\"989.5\" cy=\"-20\" r=\"3.3\" opacity=\"0.85\" style=\"animation-duration:10.0s;animation-delay:-6.8s\"/><circle class=\"ef-sa\" cx=\"48.1\" cy=\"-20\" r=\"2.1\" opacity=\"0.74\" style=\"animation-duration:11.2s;animation-delay:-10.7s\"/><circle class=\"ef-sb\" cx=\"649.3\" cy=\"-20\" r=\"3.4\" opacity=\"0.73\" style=\"animation-duration:9.3s;animation-delay:-6.3s\"/><circle class=\"ef-sa\" cx=\"520.3\" cy=\"-20\" r=\"2.2\" opacity=\"0.87\" style=\"animation-duration:9.9s;animation-delay:-8.9s\"/><circle class=\"ef-sa\" cx=\"887.1\" cy=\"-20\" r=\"3.0\" opacity=\"0.81\" style=\"animation-duration:7.6s;animation-delay:-6.4s\"/><circle class=\"ef-sa\" cx=\"233\" cy=\"-20\" r=\"3.4\" opacity=\"0.66\" style=\"animation-duration:8.4s;animation-delay:-7.1s\"/><circle class=\"ef-sb\" cx=\"914.1\" cy=\"-20\" r=\"3.4\" opacity=\"0.74\" style=\"animation-duration:7.5s;animation-delay:-0.6s\"/><circle class=\"ef-sb\" cx=\"767.4\" cy=\"-20\" r=\"3.5\" opacity=\"0.73\" style=\"animation-duration:7.9s;animation-delay:-1.1s\"/><circle class=\"ef-sb\" cx=\"281.3\" cy=\"-20\" r=\"3.5\" opacity=\"0.76\" style=\"animation-duration:9.9s;animation-delay:-6.7s\"/><circle class=\"ef-sb\" cx=\"530.1\" cy=\"-20\" r=\"3.0\" opacity=\"0.50\" style=\"animation-duration:8.7s;animation-delay:-7.8s\"/><circle class=\"ef-sa\" cx=\"1129\" cy=\"-20\" r=\"2.0\" opacity=\"0.66\" style=\"animation-duration:8.2s;animation-delay:-6.7s\"/><circle class=\"ef-sb\" cx=\"1202.3\" cy=\"-20\" r=\"2.9\" opacity=\"0.86\" style=\"animation-duration:12.8s;animation-delay:-11.9s\"/><circle class=\"ef-sa\" cx=\"120\" cy=\"-20\" r=\"3.2\" opacity=\"0.88\" style=\"animation-duration:7.4s;animation-delay:-1.0s\"/><circle class=\"ef-sb\" cx=\"1066.3\" cy=\"-20\" r=\"3.5\" opacity=\"0.55\" style=\"animation-duration:11.9s;animation-delay:-10.7s\"/><circle class=\"ef-sa\" cx=\"142\" cy=\"-20\" r=\"4.1\" opacity=\"0.76\" style=\"animation-duration:9.9s;animation-delay:-4.0s\"/><circle class=\"ef-sb\" cx=\"376.8\" cy=\"-20\" r=\"2.7\" opacity=\"0.83\" style=\"animation-duration:11.4s;animation-delay:-0.0s\"/><circle class=\"ef-sb\" cx=\"92.5\" cy=\"-20\" r=\"4.0\" opacity=\"0.77\" style=\"animation-duration:11.5s;animation-delay:-10.4s\"/><circle class=\"ef-sb\" cx=\"22.5\" cy=\"-20\" r=\"2.9\" opacity=\"0.84\" style=\"animation-duration:8.7s;animation-delay:-0.7s\"/><circle class=\"ef-sb\" cx=\"1024.9\" cy=\"-20\" r=\"2.6\" opacity=\"0.47\" style=\"animation-duration:12.6s;animation-delay:-8.3s\"/><circle class=\"ef-sa\" cx=\"256.6\" cy=\"-20\" r=\"2.6\" opacity=\"0.68\" style=\"animation-duration:10.8s;animation-delay:-2.1s\"/><circle class=\"ef-sb\" cx=\"1063\" cy=\"-20\" r=\"3.8\" opacity=\"0.73\" style=\"animation-duration:9.2s;animation-delay:-8.4s\"/><circle class=\"ef-sa\" cx=\"853.9\" cy=\"-20\" r=\"2.1\" opacity=\"0.78\" style=\"animation-duration:12.6s;animation-delay:-5.7s\"/><circle class=\"ef-sb\" cx=\"556.7\" cy=\"-20\" r=\"4.0\" opacity=\"0.70\" style=\"animation-duration:11.5s;animation-delay:-2.0s\"/><circle class=\"ef-sb\" cx=\"318.2\" cy=\"-20\" r=\"3.6\" opacity=\"0.89\" style=\"animation-duration:9.5s;animation-delay:-2.5s\"/><circle class=\"ef-sb\" cx=\"553.6\" cy=\"-20\" r=\"3.5\" opacity=\"0.50\" style=\"animation-duration:10.9s;animation-delay:-7.0s\"/><circle class=\"ef-sb\" cx=\"639\" cy=\"-20\" r=\"3.0\" opacity=\"0.60\" style=\"animation-duration:7.5s;animation-delay:-5.7s\"/><circle class=\"ef-sa\" cx=\"250\" cy=\"-20\" r=\"2.4\" opacity=\"0.70\" style=\"animation-duration:9.6s;animation-delay:-3.1s\"/><circle class=\"ef-sa\" cx=\"1066.8\" cy=\"-20\" r=\"3.6\" opacity=\"0.64\" style=\"animation-duration:9.2s;animation-delay:-3.8s\"/><circle class=\"ef-sb\" cx=\"283.2\" cy=\"-20\" r=\"3.7\" opacity=\"0.67\" style=\"animation-duration:10.1s;animation-delay:-5.8s\"/><circle class=\"ef-sa\" cx=\"57.6\" cy=\"-20\" r=\"4.0\" opacity=\"0.62\" style=\"animation-duration:9.2s;animation-delay:-5.9s\"/><circle class=\"ef-sb\" cx=\"1017.8\" cy=\"-20\" r=\"3.9\" opacity=\"0.46\" style=\"animation-duration:9.6s;animation-delay:-0.3s\"/></g>\n</g>\n<path class=\"ef-lead\" id=\"ef-solar-lead\" d=\"M540 244V585\"/>\n<path class=\"ef-lead\" id=\"ef-home-lead\" d=\"M844.5 369V722\"/>\n<path class=\"ef-lead\" id=\"ef-b1-lead\" d=\"M388 1068V1132\"/>\n<path class=\"ef-lead\" id=\"ef-b2-lead\" d=\"M495 1043.4V1132\"/>\n<path class=\"ef-lead\" id=\"ef-grid-lead\" d=\"M895 1132V1072\"/>\n<path class=\"ef-lead\" id=\"ef-ev-lead\" d=\"M102 369V796\"/>\n<path id=\"ef-tap-garage\" class=\"ef-tap\" d=\"M0 714 235 797.5 235 1047.5 0 964Z\"/>\n<path id=\"ef-tap-window\" class=\"ef-tap\" d=\"M757 734.5 931.5 696.9825 931.5 855.4825 757 893Z\"/>\n<g id=\"ef-labels\">\n<g id=\"ef-solar-label\">\n<text x=\"540.5\" y=\"174\" class=\"ef-cap\" text-anchor=\"middle\" id=\"ef-solar-name\">SOLAR</text>\n<text x=\"540.5\" y=\"228\" class=\"ef-val\" text-anchor=\"middle\" id=\"ef-solar\">0.3 kW</text>\n</g>\n<text x=\"844.5\" y=\"299.5\" class=\"ef-cap\" text-anchor=\"middle\" id=\"ef-home-name\">HOME</text>\n<text x=\"844.5\" y=\"353\" class=\"ef-val\" text-anchor=\"middle\" id=\"ef-home\">1.0 kW</text>\n<foreignObject id=\"ef-extras\" x=\"534\" y=\"252\" width=\"621\" height=\"0\" display=\"none\"><div xmlns=\"http://www.w3.org/1999/xhtml\" class=\"ef-extras\"></div></foreignObject>\n<g id=\"ef-ev-label\">\n<text x=\"98.5\" y=\"299.5\" class=\"ef-cap\" id=\"ef-ev-name\">EV</text>\n<text x=\"98\" y=\"353\" class=\"ef-val\"><tspan id=\"ef-ev\">3.7 kW</tspan><tspan id=\"ef-ev-dir\" class=\"ef-dir\" style=\"fill:var(--ef-ev-dir,#b49cef)\" dx=\"8\" dy=\"-6\">▲</tspan><tspan id=\"ef-ev-soc\" dx=\"7\" dy=\"6\">64%</tspan></text>\n</g>\n<g id=\"ef-b1-label\">\n<text x=\"391.5\" y=\"1168\" class=\"ef-cap\" text-anchor=\"end\" id=\"ef-b1-name\">BATTERY 1</text>\n<text x=\"390.5\" y=\"1222\" class=\"ef-val\" text-anchor=\"end\"><tspan id=\"ef-b1\">0.5 kW</tspan><tspan id=\"ef-b1-dir\" class=\"ef-dir\" style=\"fill:var(--ef-b1-dir,#6ade93)\" dx=\"8\" dy=\"-6\">▼</tspan><tspan id=\"ef-b1-soc\" dx=\"7\" dy=\"6\">68%</tspan></text>\n</g>\n<g id=\"ef-b2-label\">\n<text x=\"492.5\" y=\"1168\" class=\"ef-cap\" id=\"ef-b2-name\">BATTERY 2</text>\n<text x=\"492\" y=\"1222\" class=\"ef-val\" text-anchor=\"start\"><tspan id=\"ef-b2\">0.2 kW</tspan><tspan id=\"ef-b2-dir\" class=\"ef-dir\" style=\"fill:var(--ef-b2-dir,#62b4f7)\" dx=\"8\" dy=\"-6\">▼</tspan><tspan id=\"ef-b2-soc\" dx=\"7\" dy=\"6\">54%</tspan></text>\n</g>\n<g id=\"ef-grid-label\">\n<text x=\"892.5\" y=\"1168\" class=\"ef-cap\" id=\"ef-grid-name\">GRID</text>\n<text x=\"892\" y=\"1222\" class=\"ef-val ef-idle\" id=\"ef-grid\">0 kW</text>\n</g>\n</g>\n</svg>\n";
const PULSE_PROFILE = {"lengths":[148,145.5,143,140.5,138,135.5,133,130.5,128,125.5,123,120.5,118,115.5,113,110.5,108,105.5,103,100.5,98,95.5,93,90.5,88,85.5,83,80.5,78,75.5,73,70.5,68,65.5,63,60.5,58,55.5,53,50.5,48,45.5,43,40.5,38,35.5,33,30.5,28,25.5,22],"opacities":[0.0003,0.0027,0.0055,0.0081,0.0107,0.0132,0.0156,0.0177,0.0196,0.021,0.022,0.0222,0.0216,0.0199,0.0168,0.0124,0.0115,0.0121,0.0128,0.0135,0.0143,0.0152,0.0161,0.0171,0.0181,0.0193,0.0205,0.0219,0.0234,0.025,0.0267,0.0287,0.0308,0.0332,0.0359,0.0388,0.0422,0.046,0.0503,0.0553,0.0612,0.068,0.0762,0.0861,0.0984,0.1139,0.1342,0.1619,0.2016,0.3178,0.2831]};
const PULSE_WORKER = "const PULSE_SPEED = 125;  // SVG units per second on every wire\nfunction compileProgram(gl, vertex, fragment) {\n  const shader = (type, source) => {\n    const s = gl.createShader(type);\n    gl.shaderSource(s, source);\n    gl.compileShader(s);\n    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;\n  };\n  const vs = shader(gl.VERTEX_SHADER, vertex), fs = shader(gl.FRAGMENT_SHADER, fragment);\n  if (!vs || !fs) return null;\n  const program = gl.createProgram();\n  gl.attachShader(program, vs);\n  gl.attachShader(program, fs);\n  gl.linkProgram(program);\n  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;\n}\n\n// Energy pulses on the GPU. In the svg each pulse is ~50 stacked dashes that all end at its head, so their opacities\n// add up to a smooth tail; moving 918 of them by CSS made the browser restyle every one on every frame, which phones\n// and tablets could not keep up with. Here each piece of a pulse is one strip along its route, and the shader works\n// out the same stacked dashes per pixel from the beat. The canvas sits over the picture; what the svg draws over\n// the pulses (meter box, panels, batteries, pipe edges, fog...) is rasterized into masks that cut them out again.\n// The stacked dashes repeat along the route, so their coverage over one period is worked out once per piece (after a\n// reading, or when the canvas changes size) into a 1-pixel-high texture: each pixel then reads one value instead of\n// adding up every dash. The strip's long edges are smoothed here too (a_out: -1 left edge, 1 right edge, pushed out by\n// a pixel), so the canvas needs no multisampling.\nconst PULSE_VERTEX = `attribute vec2 a_pos,a_n,a_e;attribute float a_s,a_out;\nuniform mat3 u_m;uniform float u_aa;varying float v_s;varying vec2 v_svg,v_e;\nvoid main(){float o=u_aa;vec3 p=u_m*vec3(a_pos+a_n*a_out*o,1.);v_svg=p.xy;v_s=a_s;v_e=a_e+vec2(a_out,-a_out)*o;\ngl_Position=vec4(p.x/585.-1.,1.-p.y/704.,0.,1.);}`;\nconst PULSE_FRAGMENT = `precision highp float;\nuniform float u_shift,u_period,u_aa,u_alpha,u_clipOn;\nuniform vec3 u_color;\nuniform vec2 u_clip[4];\nuniform vec4 u_box;\nuniform sampler2D u_mask,u_pattern;\nvarying float v_s;varying vec2 v_svg,v_e;\nfloat edge(vec2 a,vec2 b){vec2 d=normalize(b-a);return (v_svg-a).y*d.x-(v_svg-a).x*d.y;}\nvoid main(){\n  float a=texture2D(u_pattern,vec2(fract((v_s+u_shift)/u_period),.5)).a*u_alpha;\n  a*=clamp(min(v_e.x,v_e.y)/u_aa+.5,0.,1.);\n  if(u_clipOn>0.){\n    float d=min(min(edge(u_clip[0],u_clip[1]),edge(u_clip[1],u_clip[2])),min(edge(u_clip[2],u_clip[3]),edge(u_clip[3],u_clip[0])));\n    a*=clamp(d/u_aa+.5,0.,1.);\n  }\n  a*=1.-texture2D(u_mask,(v_svg-u_box.xy)/u_box.zw).a;\n  gl_FragColor=vec4(u_color*a,a);\n}`;\n// One piece's dashes over one period, as alpha: what the shader worked out per pixel before (a dash of length L\n// starts lead*L ahead of the beat, its ends smoothed over aa), sampled finely enough for the texture's linear filter.\nfunction dashPattern(lengths, opacities, lead, period, aa, size) {\n  const out = new Uint8Array(size), dashes = [];\n  for (let i = 0; i < lengths.length; i++) if (opacities[i] > 0) dashes.push([lengths[i], opacities[i]]);\n  for (let k = 0; k < size; k++) {\n    const x = (k + .5) / size * period;\n    let keep = 1;\n    for (const [L, o] of dashes) {\n      const u = ((x + lead * L) % period + period) % period;\n      const c = Math.max(Math.min(Math.max(Math.min(u, L - u) / aa + .5, 0), 1), Math.min(Math.max((u - period) / aa + .5, 0), 1));\n      keep *= 1 - o * c;\n    }\n    out[k] = Math.round((1 - keep) * 255);\n  }\n  return out;\n}\nconst PULSE_BOX = [0, 640, 1000, 520];  // x, y, width, height: where pulses can be, in the picture's units\n// The GPU receives the same route geometry, masks and scene on either thread.\nclass PulsePainter {\n  constructor(canvas, profile) {\n    this.canvas = canvas;\n    this.profile = profile;\n    this.routes = [];\n    this.masks = [];\n    const gl = this.gl = canvas.getContext(\"webgl\", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });\n    if (!gl || gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) < 16 || !this.build()) throw new Error(\"Pulse WebGL unavailable\");\n  }\n\n  build() {\n    const gl = this.gl, program = compileProgram(gl, PULSE_VERTEX, PULSE_FRAGMENT);\n    if (!program) return false;\n    gl.useProgram(program);\n    this.a = {};\n    for (const n of [\"pos\", \"n\", \"e\", \"s\", \"out\"]) { this.a[n] = gl.getAttribLocation(program, `a_${n}`); gl.enableVertexAttribArray(this.a[n]); }\n    this.u = {};\n    for (const n of [\"u_m\", \"u_shift\", \"u_period\", \"u_aa\", \"u_alpha\", \"u_clipOn\", \"u_color\", \"u_clip\", \"u_box\", \"u_mask\", \"u_pattern\"]) {\n      this.u[n] = gl.getUniformLocation(program, n);\n    }\n    gl.uniform1i(this.u.u_mask, 0);\n    gl.uniform1i(this.u.u_pattern, 1);\n    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);\n    this.maxPattern = Math.min(4096, gl.getParameter(gl.MAX_TEXTURE_SIZE) || 2048);\n    gl.enable(gl.BLEND);\n    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);\n    this.blank = this.texture(new Uint8Array([0, 0, 0, 0]));\n    return true;\n  }\n\n  texture(pixel) {\n    const gl = this.gl, t = gl.createTexture();\n    gl.bindTexture(gl.TEXTURE_2D, t);\n    for (const p of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE);\n    for (const p of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, p, gl.LINEAR);\n    if (pixel) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);\n    return t;\n  }\n\n  resize(w, h) {\n    this.canvas.width = w;\n    this.canvas.height = h;\n    this.gl.viewport(0, 0, w, h);\n  }\n\n  geometry(id, data) {\n    const gl = this.gl, buffer = gl.createBuffer();\n    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);\n    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);\n    this.routes[id] = { buffer, count: data.length / 8 };\n  }\n\n  mask(id, image) {\n    const gl = this.gl;\n    if (!image) {\n      if (this.masks[id]) gl.deleteTexture(this.masks[id]);\n      this.masks[id] = null;\n      return;\n    }\n    this.masks[id] ??= this.texture();\n    gl.activeTexture(gl.TEXTURE0);\n    gl.bindTexture(gl.TEXTURE_2D, this.masks[id]);\n    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);\n  }\n\n  // Binds the piece's dash pattern, worked out again when its dashes, beat or the pixel size changed.\n  pattern(piece, resource, aa) {\n    const gl = this.gl, key = `${piece.lead}|${piece.period}|${aa}`;\n    resource.patternTexture ??= this.texture();\n    gl.bindTexture(gl.TEXTURE_2D, resource.patternTexture);\n    if (resource.patternKey === key) return;\n    resource.patternKey = key;\n    // two texels to a pixel at least; a power of two, so the texture can repeat\n    let size = 64;\n    while (size < piece.period / aa * 2 && size < this.maxPattern) size *= 2;\n    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);\n    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, size, 1, 0, gl.ALPHA, gl.UNSIGNED_BYTE,\n      dashPattern(this.profile.lengths, this.profile.opacities, piece.lead, piece.period, aa, size));\n  }\n\n  paint(pieces, beat) {\n    const gl = this.gl, u = this.u, aa = 1170 / this.canvas.width;\n    gl.clearColor(0, 0, 0, 0);\n    gl.clear(gl.COLOR_BUFFER_BIT);\n    gl.uniform1f(u.u_aa, aa);\n    gl.uniform4f(u.u_box, ...PULSE_BOX);\n    for (const piece of pieces) {\n      const resource = this.routes[piece.id];\n      gl.uniformMatrix3fv(u.u_m, false, piece.matrix);\n      gl.uniform1f(u.u_shift, piece.direction * (beat % piece.period) + piece.fixed);\n      gl.uniform1f(u.u_period, piece.period);\n      gl.uniform1f(u.u_alpha, piece.alpha);\n      gl.uniform3fv(u.u_color, piece.color);\n      gl.uniform1f(u.u_clipOn, piece.clip ? 1 : 0);\n      if (piece.clip) gl.uniform2fv(u.u_clip, piece.clip);\n      gl.activeTexture(gl.TEXTURE1);\n      this.pattern(piece, resource, aa);\n      gl.activeTexture(gl.TEXTURE0);\n      gl.bindTexture(gl.TEXTURE_2D, this.masks[piece.level] || this.blank);\n      gl.bindBuffer(gl.ARRAY_BUFFER, resource.buffer);\n      const at = this.a;\n      gl.vertexAttribPointer(at.pos, 2, gl.FLOAT, false, 32, 0);\n      gl.vertexAttribPointer(at.n, 2, gl.FLOAT, false, 32, 8);\n      gl.vertexAttribPointer(at.e, 2, gl.FLOAT, false, 32, 16);\n      gl.vertexAttribPointer(at.s, 1, gl.FLOAT, false, 32, 24);\n      gl.vertexAttribPointer(at.out, 1, gl.FLOAT, false, 32, 28);\n      gl.drawArrays(gl.TRIANGLES, 0, resource.count);\n    }\n  }\n}\n\n// The page supplies route changes. This clock keeps the last scene moving while Lovelace handles other work.\n\nlet painter, scene, raf = 0, nextFrame = 0;\nfunction paint(now) {\n  const beat = (performance.timeOrigin + now - scene.origin) * PULSE_SPEED / 1000;\n  painter.paint(scene.pieces, beat);\n}\nfunction frame(now) {\n  raf = 0;\n  if (!scene?.fps) return;\n  if (now >= nextFrame - 1) {\n    paint(now);\n    const interval = 1000 / scene.fps;\n    if (now - nextFrame >= interval) nextFrame = now;\n    nextFrame += interval;\n  }\n  raf = requestAnimationFrame(frame);\n}\nself.onmessage = ({ data }) => {\n  switch (data.type) {\n    case \"init\":\n      if (typeof requestAnimationFrame !== \"function\") throw new Error(\"Worker animation frames unavailable\");\n      painter = new PulsePainter(data.surface, data.profile);\n      data.surface.addEventListener(\"webglcontextlost\", () => postMessage(\"lost\"));\n      break;\n    case \"resize\": painter.resize(data.w, data.h); break;\n    case \"geometry\": painter.geometry(data.id, data.vertices); break;\n    case \"mask\":\n      painter.mask(data.id, data.image);\n      data.image?.close();\n      break;\n    case \"scene\":\n      scene = data;\n      if (scene.fps) {\n        if (!raf) { nextFrame = 0; raf = requestAnimationFrame(frame); }\n      } else {\n        cancelAnimationFrame(raf);\n        raf = 0;\n        paint(performance.now());\n      }\n      break;\n  }\n};\n";
const PULSE_SPEED = 125;  // SVG units per second on every wire
function compileProgram(gl, vertex, fragment) {
  const shader = (type, source) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, source);
    gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = shader(gl.VERTEX_SHADER, vertex), fs = shader(gl.FRAGMENT_SHADER, fragment);
  if (!vs || !fs) return null;
  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  return gl.getProgramParameter(program, gl.LINK_STATUS) ? program : null;
}

// Energy pulses on the GPU. In the svg each pulse is ~50 stacked dashes that all end at its head, so their opacities
// add up to a smooth tail; moving 918 of them by CSS made the browser restyle every one on every frame, which phones
// and tablets could not keep up with. Here each piece of a pulse is one strip along its route, and the shader works
// out the same stacked dashes per pixel from the beat. The canvas sits over the picture; what the svg draws over
// the pulses (meter box, panels, batteries, pipe edges, fog...) is rasterized into masks that cut them out again.
// The stacked dashes repeat along the route, so their coverage over one period is worked out once per piece (after a
// reading, or when the canvas changes size) into a 1-pixel-high texture: each pixel then reads one value instead of
// adding up every dash. The strip's long edges are smoothed here too (a_out: -1 left edge, 1 right edge, pushed out by
// a pixel), so the canvas needs no multisampling.
const PULSE_VERTEX = `attribute vec2 a_pos,a_n,a_e;attribute float a_s,a_out;
uniform mat3 u_m;uniform float u_aa;varying float v_s;varying vec2 v_svg,v_e;
void main(){float o=u_aa;vec3 p=u_m*vec3(a_pos+a_n*a_out*o,1.);v_svg=p.xy;v_s=a_s;v_e=a_e+vec2(a_out,-a_out)*o;
gl_Position=vec4(p.x/585.-1.,1.-p.y/704.,0.,1.);}`;
const PULSE_FRAGMENT = `precision highp float;
uniform float u_shift,u_period,u_aa,u_alpha,u_clipOn;
uniform vec3 u_color;
uniform vec2 u_clip[4];
uniform vec4 u_box;
uniform sampler2D u_mask,u_pattern;
varying float v_s;varying vec2 v_svg,v_e;
float edge(vec2 a,vec2 b){vec2 d=normalize(b-a);return (v_svg-a).y*d.x-(v_svg-a).x*d.y;}
void main(){
  float a=texture2D(u_pattern,vec2(fract((v_s+u_shift)/u_period),.5)).a*u_alpha;
  a*=clamp(min(v_e.x,v_e.y)/u_aa+.5,0.,1.);
  if(u_clipOn>0.){
    float d=min(min(edge(u_clip[0],u_clip[1]),edge(u_clip[1],u_clip[2])),min(edge(u_clip[2],u_clip[3]),edge(u_clip[3],u_clip[0])));
    a*=clamp(d/u_aa+.5,0.,1.);
  }
  a*=1.-texture2D(u_mask,(v_svg-u_box.xy)/u_box.zw).a;
  gl_FragColor=vec4(u_color*a,a);
}`;
// One piece's dashes over one period, as alpha: what the shader worked out per pixel before (a dash of length L
// starts lead*L ahead of the beat, its ends smoothed over aa), sampled finely enough for the texture's linear filter.
function dashPattern(lengths, opacities, lead, period, aa, size) {
  const out = new Uint8Array(size), dashes = [];
  for (let i = 0; i < lengths.length; i++) if (opacities[i] > 0) dashes.push([lengths[i], opacities[i]]);
  for (let k = 0; k < size; k++) {
    const x = (k + .5) / size * period;
    let keep = 1;
    for (const [L, o] of dashes) {
      const u = ((x + lead * L) % period + period) % period;
      const c = Math.max(Math.min(Math.max(Math.min(u, L - u) / aa + .5, 0), 1), Math.min(Math.max((u - period) / aa + .5, 0), 1));
      keep *= 1 - o * c;
    }
    out[k] = Math.round((1 - keep) * 255);
  }
  return out;
}
const PULSE_BOX = [0, 640, 1000, 520];  // x, y, width, height: where pulses can be, in the picture's units
// The GPU receives the same route geometry, masks and scene on either thread.
class PulsePainter {
  constructor(canvas, profile) {
    this.canvas = canvas;
    this.profile = profile;
    this.routes = [];
    this.masks = [];
    const gl = this.gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
    if (!gl || gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS) < 16 || !this.build()) throw new Error("Pulse WebGL unavailable");
  }

  build() {
    const gl = this.gl, program = compileProgram(gl, PULSE_VERTEX, PULSE_FRAGMENT);
    if (!program) return false;
    gl.useProgram(program);
    this.a = {};
    for (const n of ["pos", "n", "e", "s", "out"]) { this.a[n] = gl.getAttribLocation(program, `a_${n}`); gl.enableVertexAttribArray(this.a[n]); }
    this.u = {};
    for (const n of ["u_m", "u_shift", "u_period", "u_aa", "u_alpha", "u_clipOn", "u_color", "u_clip", "u_box", "u_mask", "u_pattern"]) {
      this.u[n] = gl.getUniformLocation(program, n);
    }
    gl.uniform1i(this.u.u_mask, 0);
    gl.uniform1i(this.u.u_pattern, 1);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    this.maxPattern = Math.min(4096, gl.getParameter(gl.MAX_TEXTURE_SIZE) || 2048);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    this.blank = this.texture(new Uint8Array([0, 0, 0, 0]));
    return true;
  }

  texture(pixel) {
    const gl = this.gl, t = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, t);
    for (const p of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE);
    for (const p of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, p, gl.LINEAR);
    if (pixel) gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    return t;
  }

  resize(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.gl.viewport(0, 0, w, h);
  }

  geometry(id, data) {
    const gl = this.gl, buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    this.routes[id] = { buffer, count: data.length / 8 };
  }

  mask(id, image) {
    const gl = this.gl;
    if (!image) {
      if (this.masks[id]) gl.deleteTexture(this.masks[id]);
      this.masks[id] = null;
      return;
    }
    this.masks[id] ??= this.texture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.masks[id]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
  }

  // Binds the piece's dash pattern, worked out again when its dashes, beat or the pixel size changed.
  pattern(piece, resource, aa) {
    const gl = this.gl, key = `${piece.lead}|${piece.period}|${aa}`;
    resource.patternTexture ??= this.texture();
    gl.bindTexture(gl.TEXTURE_2D, resource.patternTexture);
    if (resource.patternKey === key) return;
    resource.patternKey = key;
    // two texels to a pixel at least; a power of two, so the texture can repeat
    let size = 64;
    while (size < piece.period / aa * 2 && size < this.maxPattern) size *= 2;
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, size, 1, 0, gl.ALPHA, gl.UNSIGNED_BYTE,
      dashPattern(this.profile.lengths, this.profile.opacities, piece.lead, piece.period, aa, size));
  }

  paint(pieces, beat) {
    const gl = this.gl, u = this.u, aa = 1170 / this.canvas.width;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(u.u_aa, aa);
    gl.uniform4f(u.u_box, ...PULSE_BOX);
    for (const piece of pieces) {
      const resource = this.routes[piece.id];
      gl.uniformMatrix3fv(u.u_m, false, piece.matrix);
      gl.uniform1f(u.u_shift, piece.direction * (beat % piece.period) + piece.fixed);
      gl.uniform1f(u.u_period, piece.period);
      gl.uniform1f(u.u_alpha, piece.alpha);
      gl.uniform3fv(u.u_color, piece.color);
      gl.uniform1f(u.u_clipOn, piece.clip ? 1 : 0);
      if (piece.clip) gl.uniform2fv(u.u_clip, piece.clip);
      gl.activeTexture(gl.TEXTURE1);
      this.pattern(piece, resource, aa);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.masks[piece.level] || this.blank);
      gl.bindBuffer(gl.ARRAY_BUFFER, resource.buffer);
      const at = this.a;
      gl.vertexAttribPointer(at.pos, 2, gl.FLOAT, false, 32, 0);
      gl.vertexAttribPointer(at.n, 2, gl.FLOAT, false, 32, 8);
      gl.vertexAttribPointer(at.e, 2, gl.FLOAT, false, 32, 16);
      gl.vertexAttribPointer(at.s, 1, gl.FLOAT, false, 32, 24);
      gl.vertexAttribPointer(at.out, 1, gl.FLOAT, false, 32, 28);
      gl.drawArrays(gl.TRIANGLES, 0, resource.count);
    }
  }
}

// Where the Sun and Moon stand for a place and moment, as the picture needs them: how far along their arc across
// the sky (0 = rising in the east, 1 = setting in the west), their altitude, the Moon's lit fraction and the angle
// of its lit side. Low-precision formulas (a few arc-minutes for the Sun, a fraction of a degree for the Moon),
// plenty for a picture and small enough to ship inside a card.

const RAD = Math.PI / 180;
const sinD = (x) => Math.sin(x * RAD);
const cosD = (x) => Math.cos(x * RAD);
const wrap360 = (x) => ((x % 360) + 360) % 360;

// Atmospheric refraction in degrees for a geometric altitude, fading out below the horizon.
function refraction(altitude) {
  if (altitude < -90 || altitude > 90) return 0;
  const h = Math.max(-1, altitude);
  let r = 1.02 / Math.tan((h + 10.3 / (h + 5.11)) * RAD) / 60;
  if (altitude < -1) r *= (altitude + 90) / 89;
  return r;
}

function sunEcliptic(d) {
  const w = 282.9404 + 4.70935e-5 * d;
  const M = wrap360(356.047 + 0.9856002585 * d);
  const e = 0.016709 - 1.151e-9 * d;
  const E = M + (e / RAD) * sinD(M) * (1 + e * cosD(M));
  const x = cosD(E) - e, y = Math.sqrt(1 - e * e) * sinD(E);
  return { lon: wrap360(Math.atan2(y, x) / RAD + w), lat: 0, dist: Math.hypot(x, y) * 23455, M, L: wrap360(M + w) };
}

function moonEcliptic(d, sun) {
  const N = 125.1228 - 0.0529538083 * d, i = 5.1454, w = 318.0634 + 0.1643573223 * d;
  const a = 60.2666, e = 0.0549, M = wrap360(115.3654 + 13.0649929509 * d);
  let E = M + (e / RAD) * sinD(M) * (1 + e * cosD(M));
  for (let k = 0; k < 5; k++) E -= (E - (e / RAD) * sinD(E) - M) / (1 - e * cosD(E));
  const xv = a * (cosD(E) - e), yv = a * Math.sqrt(1 - e * e) * sinD(E);
  const v = Math.atan2(yv, xv) / RAD, r = Math.hypot(xv, yv);
  const xh = r * (cosD(N) * cosD(v + w) - sinD(N) * sinD(v + w) * cosD(i));
  const yh = r * (sinD(N) * cosD(v + w) + cosD(N) * sinD(v + w) * cosD(i));
  const zh = r * sinD(v + w) * sinD(i);
  let lon = Math.atan2(yh, xh) / RAD, lat = Math.atan2(zh, Math.hypot(xh, yh)) / RAD, dist = r;
  const Ms = sun.M, Lm = M + w + N, D = Lm - sun.L, F = Lm - N;
  lon += -1.274 * sinD(M - 2 * D) + 0.658 * sinD(2 * D) - 0.186 * sinD(Ms) - 0.059 * sinD(2 * M - 2 * D)
    - 0.057 * sinD(M - 2 * D + Ms) + 0.053 * sinD(M + 2 * D) + 0.046 * sinD(2 * D - Ms) + 0.041 * sinD(M - Ms)
    - 0.035 * sinD(D) - 0.031 * sinD(M + Ms) - 0.015 * sinD(2 * F - 2 * D) + 0.011 * sinD(M - 4 * D);
  lat += -0.173 * sinD(F - 2 * D) - 0.055 * sinD(M - F - 2 * D) - 0.046 * sinD(M + F - 2 * D)
    + 0.033 * sinD(F + 2 * D) + 0.017 * sinD(2 * M + F);
  dist += -0.58 * cosD(M - 2 * D) - 0.46 * cosD(2 * D);
  return { lon: wrap360(lon), lat, dist };
}

function equatorial({ lon, lat }, obliquity) {
  const x = cosD(lon) * cosD(lat);
  const y = cosD(obliquity) * sinD(lon) * cosD(lat) - sinD(obliquity) * sinD(lat);
  const z = sinD(obliquity) * sinD(lon) * cosD(lat) + cosD(obliquity) * sinD(lat);
  return { ra: wrap360(Math.atan2(y, x) / RAD), dec: Math.atan2(z, Math.hypot(x, y)) / RAD };
}

function energySky(latitude, longitude, ms) {
  const jd = ms / 86400000 + 2440587.5;
  const d = jd - 2451543.5;  // days from 2000 Jan 0.0, the formulas' epoch
  const obliquity = 23.4393 - 3.563e-7 * d;
  const sidereal = wrap360(280.46061837 + 360.98564736629 * (jd - 2451545)) + longitude;

  const sunEcl = sunEcliptic(d);
  const moonEcl = moonEcliptic(d, sunEcl);

  function position({ ra, dec }, parallax = 0) {
    let hourAngle = wrap360(sidereal - ra + 180) - 180;
    if (parallax) {
      // Seen from the ground, not the Earth's centre (matters for the Moon only).
      const sp = sinD(parallax);
      const shift = Math.atan2(-cosD(latitude) * sp * sinD(hourAngle), cosD(dec) - cosD(latitude) * sp * cosD(hourAngle)) / RAD;
      dec = Math.atan2((sinD(dec) - sinD(latitude) * sp) * cosD(shift), cosD(dec) - cosD(latitude) * sp * cosD(hourAngle)) / RAD;
      hourAngle -= shift;
    }
    const sinAlt = sinD(latitude) * sinD(dec) + cosD(latitude) * cosD(dec) * cosD(hourAngle);
    const altitude = Math.asin(Math.max(-1, Math.min(1, sinAlt))) / RAD;
    const azimuth = wrap360(Math.atan2(sinD(hourAngle), cosD(hourAngle) * sinD(latitude) - Math.tan(dec * RAD) * cosD(latitude)) / RAD + 180);
    // Project the visible arc from east to west. A circumpolar body uses a full rotation.
    // -0.83° accounts for typical horizon refraction and the radius of the Sun or Moon.
    const horizon = (sinD(-0.83) - sinD(latitude) * sinD(dec)) / Math.max(1e-9, cosD(latitude) * cosD(dec));
    const halfArc = Math.max(1, Math.acos(Math.max(-1, Math.min(1, horizon))) / RAD);
    const progress = Math.max(0, Math.min(1, (hourAngle / halfArc + 1) / 2));
    return { progress, altitude: altitude + refraction(altitude), geometric: altitude, azimuth };
  }

  const sun = position(equatorial(sunEcl, obliquity));
  const moon = position(equatorial(moonEcl, obliquity), Math.asin(1 / moonEcl.dist) / RAD);

  // Project the direction to the Sun onto the Moon's disk, relative to the local vertical.
  const dAz = (sun.azimuth - moon.azimuth) * RAD;
  const sa = sun.geometric * RAD, ma = moon.geometric * RAD;
  const right = Math.cos(sa) * Math.sin(dAz);
  const up = Math.sin(sa) * Math.cos(ma) - Math.cos(sa) * Math.sin(ma) * Math.cos(dAz);
  const elongation = Math.acos(cosD(moonEcl.lon - sunEcl.lon) * cosD(moonEcl.lat));
  const phaseAngle = Math.atan2(Math.sin(elongation), moonEcl.dist / 23455 - Math.cos(elongation));
  const round = (x, n) => Math.round(x * 10 ** n) / 10 ** n;
  return {
    sun: { progress: round(sun.progress, 5), altitude: round(sun.altitude, 3) },
    moon: {
      progress: round(moon.progress, 5), altitude: round(moon.altitude, 3),
      tilt: round(Math.atan2(-up, right) / RAD, 2),
      illuminated: round((1 + Math.cos(phaseAngle)) / 2, 5),
    },
  };
}

// The picture of the house and what it does: readings in, moving pulses, labels, sky and weather out.
// One view per card. It owns the inlined SVG and updates it in place, so its animations run on between updates.

const FLOW_MIN = 50;  // watts: less than this reads as "0 kW" and draws no flow
const SHORTEST_CYCLE = 275;  // very short routes should not flash rapidly
const LANE_FADE = 700;  // ms: a lane going away has faded (.ef-line's .55 s slide and .4 s fade in the svg)
const LANE_GAP = 19;  // between neighbouring lanes on the wall, in the picture's own units
const MOON_RADIUS = 22;
const HORIZON = -.27;  // the apparent centre is just below the horizon when the upper edge rises
const GRID_FLOWS = ["grid", "grid2", "grid3", "grid4"];
const EV_FLOWS = ["ev", "ev2", "ev3", "ev4"];
const B1_FLOWS = ["b1", "b1-2", "b1-3", "b1-4"], B2_FLOWS = ["b2", "b2-2", "b2-3", "b2-4"];
const HOT = 30;  // °C: above this the air shimmers
const FROST_START = 3;  // °C: frost begins to form here...
const FROST_FULL = -10;  // ...and is fully grown here
const GARAGE_MOVES = 1800;  // ms the shutter takes to roll up or down, with its delay
const EXTRA_ROW = 38;  // picture units between the rows of home's other loads (the list's line-height)
const EXTRA_ROWS = 5.5;  // rows in sight at most, up into the sky above home: the half row shows the list goes on
const EXTRA_BOTTOM = 252;  // where the list ends, just above the home label

// The weather the picture can draw, and how much of the sky (sun, moon, twilight) shows through each.
const WEATHERS = ["clear", "partly", "cloudy", "fog", "drizzle", "rain", "heavy", "snow", "storm"];
const PICTURE_WEATHER = { clear: "clear", partly: "cloudy", cloudy: "cloudy", fog: "fog", drizzle: "drizzle", rain: "rain", heavy: "heavy", snow: "snow", storm: "storm" };
// Snow showers let some sky through, so a winter moon still shows.
const SKY_VISIBILITY = { clear: 1, partly: .62, cloudy: .12, snow: .5 };

// Where each lane into the house sits (LANE_GAP apart, 0 = in line with battery 1's pipe), given which sources feed
// the house; b2Alone: battery 2 busy and battery 1 not, so a lone line runs in line with battery 2's pipe. Lanes that
// do not run get the place they would take, for their fade. Five lanes do not fit (places -1 to 2): with both
// batteries feeding and one lane too many, the batteries share battery 1's line and the car takes battery 2's place.
function housePlaces(fed, b2Alone) {
  const ORDER = ["solar", "b1", "b2", "grid", "ev"], SHARED = ["solar", "b1", "ev", "grid"];
  const plan = (share) => {
    const order = share ? SHARED : ORDER, list = order.filter((k) => fed[k]);
    const count = list.length;
    let anchor = 0, at = count <= 1 && b2Alone ? 1 : 0;  // the first lane, at the top place
    if (list.includes("b1")) [anchor, at] = [list.indexOf("b1"), 0];
    else if (list.includes("b2")) [anchor, at] = [list.indexOf("b2"), 1];
    const places = {};
    list.forEach((k, i) => { places[k] = at + i - anchor; });
    if (share) places.b2 = places.b1;
    return places;
  };
  let share = false, places = plan(false);
  const lowest = () => Math.max(0, ...Object.values(places));
  if (lowest() > 2 && fed.b1 && fed.b2) { share = true; places = plan(true); }
  const shift = Math.max(0, lowest() - 2);  // still too low: all up
  for (const k of Object.keys(places)) places[k] -= shift;
  // the rest, where they would come and go: solar on top, the batteries at their pipes, the grid and the car below
  const top = Math.min(0, ...Object.values(places)), bottom = Math.min(2, lowest() + 1);
  const idle = Object.keys(places).length ? null : (b2Alone ? 1 : 0);
  places.solar ??= Math.max(-1, top - 1);
  places.b1 ??= 0;
  places.b2 ??= 1;
  places.grid ??= idle ?? bottom;
  places.ev ??= idle ?? bottom;
  return { places, share };
}

// 6 December to 6 January
function christmasSeason(time) {
  const day = new Date(time ?? Date.now()), md = (day.getMonth() + 1) * 100 + day.getDate();
  return md >= 1206 || md <= 106;
}

const DEFAULTS = {
  solar: { show: true, name: "Solar", color: "#d6a62c" },
  home: { name: "Home" },
  ev: { name: "EV", color: "#9b7bea" },
  grid: { name: "Grid", color: "#cfd3d6" },
  battery1: { show: true, name: "Battery 1", color: "#4dbd80", face: "#eeeeee" },
  battery2: { show: true, name: "Battery 2", color: "#4aa5f2", face: "#4b4e54" },
  look: { glass: "#2d334d", roof: "#333333", wall: "#0a0a0a", window: "#d6d3ca", background: "#17181a" },
};
// Light mode: what replaces a default colour the owner left as it is. The house's own light colours are in the
// svg's .ef-light rule; these are the ones the card itself sets.
const LIGHT = { grid: { color: "#8a9097" }, look: { background: "#e8e9eb" } };
// The colour a part is drawn in: the owner's, or in light mode the light one where theirs is the default.
function themed(cfg, part, key) {
  const value = cfg[part]?.[key];
  return cfg.light && LIGHT[part]?.[key] && (!value || value.toLowerCase() === DEFAULTS[part][key]) ? LIGHT[part][key] : value;
}

const missing = (v) => v === null || v === undefined || Number.isNaN(v);
const flow = (v) => (missing(v) || Math.abs(v) < FLOW_MIN ? 0 : v);
const kw = (v) => (missing(v) ? "–" : Math.abs(v) < FLOW_MIN ? "0 kW" : `${(Math.abs(v) / 1000).toFixed(1)} kW`);
const skyX = (progress) => 65 + progress * 1040;

function smoothstep(low, high, value) {
  const x = Math.max(0, Math.min(1, (value - low) / (high - low)));
  return x * x * (3 - 2 * x);
}

function linearLight(channel) {
  const srgb = channel / 255;
  return srgb <= .04045 ? srgb / 12.92 : ((srgb + .055) / 1.055) ** 2.4;
}

// Colours: "#rgb" / "#rrggbb" in, mixes out, so one chosen colour can drive a part's whole gradient.
function rgb(hex) {
  let h = String(hex).trim().replace(/^#/, "");
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function mix(hex, other, t) {
  const a = rgb(hex), b = rgb(other);
  if (!a || !b) return hex;
  return "#" + a.map((v, i) => Math.round(v + (b[i] - v) * t).toString(16).padStart(2, "0")).join("");
}
const validColor = (hex) => !!rgb(hex);
// A light wall tinted by moonlight as the sky darkens (see .ef-light in the svg), where the browser has color-mix.
const DUSK = typeof CSS !== "undefined" && CSS.supports?.("color", "color-mix(in srgb, red, blue 10%)");
const dusk = (c) => (DUSK ? `color-mix(in srgb, ${c}, var(--ef-n-wall, #8e9cc4) calc(var(--ef-darkness, 0) * var(--ef-n-wall-p, 26%)))` : c);

// Every colour the picture takes from the config, as the SVG's custom properties. Only colours that differ from
// the drawing's own are set, so an untouched card looks exactly as drawn (in light mode, as the .ef-light rule has it).
function colorVars(cfg) {
  const vars = {};
  const set = (part, key, fn) => {
    const value = cfg[part]?.[key];
    if (value && validColor(value) && value.toLowerCase() !== DEFAULTS[part][key]) Object.assign(vars, fn(value));
  };
  set("solar", "color", (c) => ({ "--ef-solar-color": c }));
  set("grid", "color", (c) => ({ "--ef-grid-color": c }));
  const light = !!cfg.light;
  set("ev", "color", (c) => ({ "--ef-ev-color": c, "--ef-ev-dir": mix(c, "#ffffff", .25) }));
  for (const n of [1, 2]) {
    set(`battery${n}`, "color", (c) => ({
      [`--ef-b${n}-color`]: c, [`--ef-b${n}-dir`]: mix(c, "#ffffff", .25),
      [`--ef-b${n}-strip-1`]: mix(c, "#d0d0d0", .4), [`--ef-b${n}-strip-2`]: mix(c, "#d0d0d0", .3),
    }));
    set(`battery${n}`, "face", (c) => ({
      [`--ef-b${n}-face-1`]: c, [`--ef-b${n}-face-2`]: mix(c, "#000000", .14), [`--ef-b${n}-mirror`]: mix(c, "#808080", .1),
    }));
  }
  set("look", "glass", (c) => ({ "--ef-glass-1": c, "--ef-glass-2": mix(c, "#000000", .27), "--ef-glass-3": mix(c, "#000000", .52) }));
  set("look", "window", (c) => ({ "--ef-window-1": c, "--ef-window-2": mix(c, "#000000", .19), "--ef-window-mirror": mix(c, "#000000", .04) }));
  // In light mode the side walls are the wall's colour in shade, dimming after dark; dark, they take the roof's (as drawn).
  set("look", "wall", (c) => (light ? {
    "--ef-wall-1": dusk(c), "--ef-wall-2": dusk(mix(c, "#000000", .03)), "--ef-gable-1": dusk(mix(c, "#000000", .1)),
    "--ef-gable-2": dusk(mix(c, "#000000", .15)), "--ef-garage-wall": dusk(mix(c, "#000000", .11)), "--ef-jamb": dusk(mix(c, "#000000", .21)),
  } : { "--ef-wall-1": c, "--ef-wall-2": mix(c, "#ffffff", .02) }));
  set("look", "roof", (c) => (light ? {
    "--ef-roof-1": c, "--ef-roof-2": mix(c, "#000000", .14), "--ef-roof-3": mix(c, "#000000", .2),
    "--ef-roof-back-1": mix(c, "#ffffff", .03), "--ef-roof-back-2": mix(c, "#000000", .05),
    "--ef-roof-edge": mix(c, "#ffffff", .15), "--ef-roof-line": mix(c, "#000000", .12), "--ef-fascia": mix(c, "#ffffff", .18),
    "--ef-roof-ridge": mix(c, "#ffffff", .28),
  } : {
    "--ef-roof-1": c, "--ef-roof-2": mix(c, "#000000", .14), "--ef-roof-3": mix(c, "#000000", .2),
    "--ef-roof-back-1": mix(c, "#ffffff", .03), "--ef-roof-back-2": mix(c, "#000000", .05),
    "--ef-gable-1": mix(c, "#000000", .25), "--ef-gable-2": mix(c, "#000000", .45),
  }));
  return vars;
}

// Heat shimmer. The SVG displacement filter this replaces ran at about 1 fps on an iPhone: Safari computes SVG
// filters on the CPU, at full screen density, on every frame. Here the picture's still parts (.ef-bake) are
// rasterized onto a canvas behind it, and a fragment shader bends them through rising noise on the GPU. The picture
// hides its own copies of those parts (.ef-baked) only once the canvas shows them; everything that moves stays live
// on top. The snapshot is taken again when the still parts change (sky, sun, colours) and cross-faded in.
const SHIMMER_VERTEX = "attribute vec2 a;varying vec2 v;void main(){v=vec2(a.x*.5+.5,.5-a.y*.5);gl_Position=vec4(a,0.,1.);}";
const SHIMMER_FRAGMENT = `precision highp float;
varying vec2 v;
uniform sampler2D u_a,u_b;
uniform float u_mix,u_t,u_scale;
uniform vec2 u_cableStart;
const vec2 SIZE=vec2(1170.,1408.);
vec2 hash(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return fract(sin(p)*43758.5453)*2.-1.;}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);
  return mix(mix(dot(hash(i),f),dot(hash(i+vec2(1.,0.)),f-vec2(1.,0.)),u.x),
             mix(dot(hash(i+vec2(0.,1.)),f-vec2(0.,1.)),dot(hash(i+vec2(1.,1.)),f-vec2(1.,1.)),u.x),u.y);}
float fbm(vec2 p){return noise(p)+.5*noise(p*2.+vec2(17.3,5.9));}
void main(){
  vec2 p=v*SIZE;
  float fade=1.-clamp((p.y-560.)/200.,0.,1.);  // only the sky and roofs shimmer: from the eaves down it fades out
  // The live cable meets the lower frame here. Keep the contact steady as the surrounding roof shimmers.
  fade*=smoothstep(20.,42.,distance(p,u_cableStart));
  vec2 d=vec2(0.);
  if(fade>0.){
    vec2 q=vec2(p.x*.011,(p.y+u_t*75.)*.042);  // stretched sideways, rising 75 units a second
    d=u_scale*.5*fade*vec2(fbm(q),fbm(q+vec2(31.7,11.1)));
  }
  vec2 uv=clamp((p+d)/SIZE,0.,1.);
  gl_FragColor=mix(texture2D(u_a,uv),texture2D(u_b,uv),u_mix);
}`;
const SHIMMER_FADE = 600;  // ms to cross-fade a new snapshot in
// A snapshot of the picture costs time (a hitch in every animation) and memory (a whole copy of the picture, which
// the browser keeps until it next collects garbage: issue #3). None is taken on a timer: only when what it shows
// has changed.
const TRANSIENT = new Set(["ef-paused", "ef-baked", "ef-still", "ef-restart", "ef-garage-moving", "ef-relabel", "ef-swap"]);
const lookKey = (svg) => [...svg.classList].filter((c) => !TRANSIENT.has(c)).join(" ")
  + "|" + svg.getAttribute("data-weather") + "|" + svg.getAttribute("data-time");
// Classes that change only what is drawn live over the shimmer canvas (the garage and its shutter, the lights, the
// lanes, the labels, the Christmas lights) or how the pulses are drawn.
const LIVE_OVER_SHIMMER = new Set(["ef-garage-open", "ef-lights-off", "ef-ev-on", "ef-shared", "ef-gl", "ef-no-gl",
  "ef-xmas-off", "ef-xmas-lit"]);
// Still parts that are drawn live even so (see .ef-baked in the svg), and so are left out of the snapshot.
const LIVE_PARTS = "#ef-garage, #ef-shutter, .ef-open-jamb, .ef-window-wall-bounce";

class HeatShimmer {
  constructor(svg, view) {
    this.svg = svg;
    this.view = view;
    this.scale = 3;
    this.markup = null;
    this.busy = false;
    this.dirty = false;
    this.shown = false;
    this.raf = 0;
    this.fadeStart = -1;
    const canvas = this.canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;pointer-events:none;visibility:hidden";  // laid out even while hidden
    const gl = this.gl = canvas.getContext("webgl", { alpha: false, antialias: false, depth: false, stencil: false });
    if (!gl || !this.build()) { this.failed = true; return; }
    canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); this.destroy(); });
    this.frame = (now) => {
      this.raf = 0;
      this.draw(now);
      if (this.running()) this.raf = requestAnimationFrame(this.frame);
    };
    this.resizer = typeof ResizeObserver === "function" ? new ResizeObserver(() => this.place()) : null;
  }

  build() {
    const gl = this.gl;
    const shader = (type, source) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, source);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = shader(gl.VERTEX_SHADER, SHIMMER_VERTEX), fs = shader(gl.FRAGMENT_SHADER, SHIMMER_FRAGMENT);
    if (!vs || !fs) return false;
    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(program, "a");
    gl.enableVertexAttribArray(a);
    gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    this.u = Object.fromEntries(["u_a", "u_b", "u_mix", "u_t", "u_scale"].map((n) => [n, gl.getUniformLocation(program, n)]));
    const cableStart = this.svg.getElementById("ef-route-solar-eave").getPointAtLength(0);
    gl.uniform2f(gl.getUniformLocation(program, "u_cableStart"), cableStart.x, cableStart.y);
    gl.uniform1i(this.u.u_a, 0);
    gl.uniform1i(this.u.u_b, 1);
    this.textures = [0, 1].map(() => {
      const t = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, t);
      for (const p of [gl.TEXTURE_WRAP_S, gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D, p, gl.CLAMP_TO_EDGE);
      for (const p of [gl.TEXTURE_MIN_FILTER, gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D, p, gl.LINEAR);
      return t;
    });
    return true;
  }

  // Shown above HOT; scale is how far the air bends the picture, in its own units.
  show(scale) {
    if (this.failed) return;
    this.scale = scale;
    if (!this.canvas.isConnected) {
      const host = this.svg.parentNode;
      positioned(host);
      positioned(this.svg);  // stays above the canvas
      host.insertBefore(this.canvas, this.svg);
      this.resizer?.observe(this.svg);
    }
    this.place();
    this.refresh();
  }

  hide() {
    cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.shown = false;
    this.markup = null;
    this.look = null;
    this.fadeStart = -1;
    this.svg.classList.remove("ef-baked");
    this.canvas.style.visibility = "hidden";
  }

  destroy() {
    if (this.dead) return;  // once: a lost context fires again on a renderer already gone
    this.dead = true;
    this.hide();
    this.failed = true;
    this.resizer?.disconnect();
    this.gl?.getExtension("WEBGL_lose_context")?.loseContext();
    this.canvas.remove();
  }

  running() {
    return this.shown && this.view.pulsesRun();
  }

  // Lines the canvas up with the picture's drawing area inside the svg box.
  place() {
    if (this.failed || !this.canvas.isConnected) return;
    const size = fitCanvas(this.canvas, this.svg, this.view.densityCap);
    if (!size) return;
    const { w, h } = size;
    if (w !== this.canvas.width || h !== this.canvas.height) {
      this.canvas.width = w;
      this.canvas.height = h;
      this.gl.viewport(0, 0, w, h);
      if (this.shown) { this.markup = null; this.refresh(); }
    }
  }

  // The still parts alone, as they look now, at the canvas's size.
  stillMarkup() {
    const clone = this.svg.cloneNode(true);
    clone.classList.remove("ef-baked", "ef-paused", "ef-still");
    clone.style.removeProperty("position");
    const scene = clone.querySelector("#ef-scene");
    for (const el of [...scene.children]) if (!el.classList.contains("ef-bake")) el.remove();
    for (const el of [...clone.children]) if (el.localName !== "defs" && el !== scene) el.remove();
    for (const el of scene.querySelectorAll(LIVE_PARTS)) el.remove();
    clone.setAttribute("width", this.canvas.width);
    clone.setAttribute("height", this.canvas.height);
    return new XMLSerializer().serializeToString(clone);
  }

  // A new snapshot, once things settle, if the still parts look any different. The shimmer is decoration and can
  // wait: when the look changes (weather, day or night, theme) it stops, the picture draws its own still parts at
  // once, and it starts again when the new snapshot is in. The sky creeping on cross-fades instead, as does a
  // snapshot asked for again (new colours, a new size).
  refresh() {
    if (this.failed || !this.canvas.width || !this.svg.classList.contains("ef-hot")) return;
    const look = this.view.shimmerLook();
    if (this.markup && this.look === look && this.sky === this.view.skyKey) return;
    if (this.shown && this.look != null && this.look !== look) this.hide();
    this.dirty = true;
    if (this.busy || (this.shown && !this.running())) return;
    this.busy = true;
    setTimeout(async () => {
      try {
        while (this.dirty && !this.failed && this.svg.classList.contains("ef-hot")) {
          this.dirty = false;
          const look = this.view.shimmerLook(), sky = this.view.skyKey;
          const markup = this.stillMarkup();
          if (markup === this.markup) { this.look = look; this.sky = sky; continue; }
          const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml" }));
          const image = new Image();
          try {
            image.src = url;
            await image.decode();
            // drawn into a bitmap away from the frame being shown, where the browser can; the upload is then quick
            let source = image;
            if (typeof createImageBitmap === "function") source = await createImageBitmap(image).catch(() => image);
            if (this.failed || !this.svg.classList.contains("ef-hot")) break;
            this.upload(source);
            source.close?.();
            this.markup = markup;
            this.look = look;
            this.sky = sky;
          } finally {
            URL.revokeObjectURL(url);
            releaseImage(image);
          }
        }
      } catch {
        this.destroy();  // no shimmer where the browser cannot rasterize the picture; it keeps its own still parts
      } finally {
        this.busy = false;
      }
    }, 250);
  }

  // Snapshot again on the next update, e.g. after new colours.
  // The snapshot in use stays: one that comes out the same (a name changed, say) is not drawn and uploaded again.
  invalidate() { this.look = null; }

  upload(image) {
    const gl = this.gl;
    if (!this.shown) {
      gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      this.shown = true;
      this.canvas.style.visibility = "inherit";  // hidden with its host
      this.draw(performance.now());
      this.svg.classList.add("ef-baked");
    } else {
      if (this.fadeStart >= 0) this.draw(this.fadeStart + SHIMMER_FADE);  // finish the previous cross-fade first
      gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      this.fadeStart = performance.now();
    }
    this.sync();
  }

  // The air moves only while the picture is on screen.
  sync() {
    if (!this.shown) return;
    if (this.running()) {
      if (!this.raf) this.raf = requestAnimationFrame(this.frame);
      if (this.dirty) this.refresh();
    } else {
      cancelAnimationFrame(this.raf);
      this.raf = 0;
      if (this.fadeStart >= 0) this.draw(this.fadeStart + SHIMMER_FADE);
    }
  }

  draw(now) {
    const gl = this.gl, u = this.u;
    let blend = 0;
    if (this.fadeStart >= 0) {
      blend = Math.min(1, (now - this.fadeStart) / SHIMMER_FADE);
      if (blend >= 1) { this.textures.reverse(); this.fadeStart = -1; blend = 0; }
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.textures[0]);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.textures[1]);
    gl.uniform1f(u.u_mix, blend);
    gl.uniform1f(u.u_t, (now / 1000) % 600);
    gl.uniform1f(u.u_scale, this.scale);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
}

// Lines a canvas up with the picture's drawing area inside the svg box; returns its size in device pixels, at
// most cap pixels per CSS pixel.
// An element that what is laid over it is placed against. Home Assistant makes a card (and the first readings go in)
// before it is on the page, when nothing has a computed position yet: anything but a known one counts as static.
// Otherwise the canvases are placed against some element outside the card and stay behind when the card moves.
function positioned(el) {
  if (!/^(relative|absolute|fixed|sticky)$/.test(getComputedStyle(el).position)) el.style.position = "relative";
}

function fitCanvas(canvas, svg, cap = Infinity, maxWidth = 2048) {
  const parent = canvas.offsetParent;
  if (!parent) return null;
  const box = svg.getBoundingClientRect(), host = parent.getBoundingClientRect();
  if (!box.width || !box.height) return null;
  let width = box.width, height = box.height;
  let left = box.left - host.left - parent.clientLeft, top = box.top - host.top - parent.clientTop;
  if (width / height > 1170 / 1408) { left += (width - height * 1170 / 1408) / 2; width = height * 1170 / 1408; }
  else { top += (height - width * 1408 / 1170) / 2; height = width * 1408 / 1170; }
  // In percentages of the host, so the canvas keeps to the picture through a resize before this runs again: turning
  // an iPhone holds back the resize callbacks for the length of the turn, and pixels left the pulses behind.
  const pw = parent.clientWidth || host.width, ph = parent.clientHeight || host.height;
  const pct = (v, of) => `${(v / of * 100).toFixed(4)}%`;
  Object.assign(canvas.style, { left: pct(left, pw), top: pct(top, ph), width: pct(width, pw), height: pct(height, ph) });
  const density = Math.min(devicePixelRatio || 1, cap, maxWidth / width);
  return { w: Math.round(width * density), h: Math.round(height * density) };
}

// A snapshot's <img> lets go of its decoded picture now. Each holds a whole SVG document of its own, and waiting for
// the garbage collector let them pile up, which Safari answers by reloading the page (issue #3).
function releaseImage(image) {
  if (typeof HTMLImageElement === "function" && image instanceof HTMLImageElement) image.removeAttribute("src");
}

const MASK_WAIT = 700;  // ms after a change before the masks are drawn again (lanes slide for .55 s)
const CONFIG_SETTLE = 400;  // ms without a config change before the picture is sampled again
class PulseRenderer {
  constructor(view) {
    this.view = view;
    this.svg = view.svg;
    this.ready = false;
    this.raf = 0;
    const canvas = this.canvas = document.createElement("canvas");
    canvas.setAttribute("aria-hidden", "true");
    canvas.style.cssText = "position:absolute;pointer-events:none;visibility:hidden";
    this.width = this.height = 0;
    if (view.level === "low" && !view.workerFailed && canvas.transferControlToOffscreen && typeof Worker === "function" && typeof createImageBitmap === "function") {
      let url;
      try {
        url = URL.createObjectURL(new Blob([view.pulseWorkerSource], { type: "text/javascript" }));
        this.worker = new Worker(url);
        this.worker.onerror = (event) => { event.preventDefault(); this.workerFallback(); };
        this.worker.onmessage = ({ data }) => { if (data === "lost") this.workerFallback(); };
        const surface = canvas.transferControlToOffscreen();
        this.worker.postMessage({ type: "init", surface, profile: view.pulseProfile }, [surface]);
      } catch {
        this.worker?.terminate();
        this.worker = null;
        view.workerFailed = true;
      } finally { if (url) URL.revokeObjectURL(url); }
    }
    if (!this.worker) {
      try { this.painter = new PulsePainter(canvas, view.pulseProfile); }
      catch { this.failed = true; return; }
      canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); this.destroy(); });
    }
    this.frame = (now) => {
      this.raf = 0;
      const start = performance.now();
      this.draw(now);
      if (!this.worker && this.view.pulsesRun() && this.hasShown) this.next(start);
    };
    this.routeCache = new Map();
    this.pieces = this.findPieces();
    this.pieces.forEach((piece, id) => { piece.id = id; });
    this.levels.forEach((level, id) => { level.id = id; });
    this.resizer = typeof ResizeObserver === "function" ? new ResizeObserver(() => this.place()) : null;
  }

  workerFallback() {
    if (this.dead) return;
    const view = this.view;
    view.workerFailed = true;
    this.destroy();
    view.pulses = null;
    if (!view.suspended && view.svg.isConnected) view.updatePulses();
  }

  // Every group of stacked dashes is one piece: same route, frame, colour and width.
  findPieces() {
    const pieces = [], levels = new Map();
    for (const flow of this.svg.querySelectorAll(".ef-flow")) {
      const groups = new Map();
      for (const dash of flow.querySelectorAll(".ef-pulse")) {
        if (!groups.has(dash.parentNode)) groups.set(dash.parentNode, []);
        groups.get(dash.parentNode).push(dash);
      }
      // Pulses at one depth in the picture share a mask: everything drawn after the first of them.
      const level = flow.closest("#ef-lines, .ef-grid-pipe, #ef-solar-drop, #ef-ev-drop, #ef-l-b1, #ef-l-b2") || flow;
      if (!levels.has(level)) levels.set(level, { first: flow, texture: null });
      for (const [group, dashes] of groups) {
        const clipHost = group.closest("[clip-path]");
        pieces.push({ group, dashes, flow, line: flow.closest(".ef-line"), level: levels.get(level),
          route: this.svg.getElementById(dashes[0].getAttribute("href").slice(1)),
          clipHost: clipHost && this.svg.contains(clipHost) ? clipHost : null });
      }
    }
    this.levels = [...levels.values()];
    return pieces;
  }

  // Sampled points along a route, cached so pieces sharing a route reuse the same SVG path measurements.
  routePoints(route) {
    let cached = this.routeCache.get(route);
    if (cached) return cached;
    const total = route.getTotalLength(), steps = Math.max(2, Math.ceil(total / 3));
    const points = [];
    for (let i = 0; i <= steps; i++) {
      const s = total * i / steps, p = route.getPointAtLength(s);
      points.push({ x: p.x, y: p.y, s });
    }
    cached = { total, points };
    this.routeCache.set(route, cached);
    return cached;
  }

  // Fixed per piece: the route as a strip, the dashes' lengths and opacities, the clip. Measured lazily when shown.
  measure(piece) {
    // Read strokeWidth from piece.group (never display:none), not piece.dashes[0]: Safari 15 returns "" -> 1px on display:none <use>.
    piece.width = parseFloat(getComputedStyle(piece.group).strokeWidth) || 1;
    const { total, points } = this.routePoints(piece.route);
    // Across the stroke: its two edges, or more columns where the head turns into a face that is cut on a slant
    // (data-head-skew="offset:lead ...", offsets across the stroke on the route's left-hand normal, leads in route
    // units, reached over the last data-head-ramp units). The grid riser's head leans that way through its bend,
    // so it meets the slanted head of the top face beyond the seam without a gap.
    const half = piece.width / 2, data = [], host = piece.group.closest("[data-head-skew]");
    let columns = [{ p: -half, lead: 0 }, { p: half, lead: 0 }], ramp = 0;
    if (host) {
      columns = host.dataset.headSkew.trim().split(/\s+/).map((t) => { const [p, lead] = t.split(":").map(Number); return { p, lead }; })
        .sort((a, b) => a.p - b.p);
      ramp = Number(host.dataset.headRamp) || 0;
    }
    // per vertex: x, y, the left-hand normal (the outer columns are pushed out along it in the shader), the distance
    // to each long edge, s, and which edge it is on
    const left = columns[0].p, right = columns[columns.length - 1].p;
    const rows = points.map((p, i) => {
      const a = points[Math.max(0, i - 1)], b = points[Math.min(points.length - 1, i + 1)];
      const dx = b.x - a.x, dy = b.y - a.y, n = Math.hypot(dx, dy) || 1, nx = -dy / n, ny = dx / n;
      const turn = ramp ? smoothstep(total - ramp, total, p.s) : 0;
      return columns.map((c, j) => [p.x + nx * c.p, p.y + ny * c.p, nx, ny, c.p - left, right - c.p, p.s - c.lead * turn,
        j === 0 ? -1 : j === columns.length - 1 ? 1 : 0]);
    });
    for (let i = 0; i + 1 < rows.length; i++) {
      for (let j = 0; j + 1 < columns.length; j++) {
        const [a, b, c, d] = [rows[i][j], rows[i][j + 1], rows[i + 1][j], rows[i + 1][j + 1]];
        data.push(...a, ...b, ...c, ...b, ...d, ...c);
      }
    }
    const vertices = new Float32Array(data);
    if (this.worker) this.worker.postMessage({ type: "geometry", id: piece.id, vertices }, [vertices.buffer]);
    else this.painter.geometry(piece.id, vertices);
    piece.measured = true;
    piece.clip = null;
    const shape = piece.clipHost && this.svg.getElementById(piece.clipHost.getAttribute("clip-path").match(/#([^)"']+)/)?.[1])?.firstElementChild;
    if (shape) {
      let corners;
      if (shape.localName === "rect") {
        const [x, y, w, h] = ["x", "y", "width", "height"].map((k) => parseFloat(shape.getAttribute(k)) || 0);
        corners = [x, y, x + w, y, x + w, y + h, x, y + h];
      } else {
        corners = (shape.getAttribute("d").match(/-?\d*\.?\d+(?:e-?\d+)?/g) || []).slice(0, 8).map(Number);
      }
      // the clip's own frame, in the picture's units
      const m = this.toPicture(piece.clipHost) || new DOMMatrix();
      const out = [];
      for (let i = 0; i < 8; i += 2) out.push(m.a * corners[i] + m.c * corners[i + 1] + m.e, m.b * corners[i] + m.d * corners[i + 1] + m.f);
      // the shader wants the corners clockwise on screen (inside on the positive side of every edge)
      let area = 0;
      for (let i = 0; i < 8; i += 2) area += out[i] * out[(i + 3) % 8] - out[(i + 2) % 8] * out[i + 1];
      if (area < 0) for (let i = 0; i < 4; i += 2) { const j = 6 - i; [out[i], out[j], out[i + 1], out[j + 1]] = [out[j], out[i], out[j + 1], out[i + 1]]; }
      piece.clip = new Float32Array(out);
    }
  }

  // An element's own units to the picture's (viewBox) units.
  toPicture(el) {
    const root = this.svg.getScreenCTM(), own = el.getScreenCTM();
    if (!root || !own) return null;
    return DOMMatrix.fromMatrix(root).inverse().multiply(DOMMatrix.fromMatrix(own));
  }

  // After each reading: which pieces run, which way, in what colour, on which beat.
  update() {
    if (this.failed || !this.svg.isConnected) return;  // off the page nothing has a computed style to read
    this.lineStates = null;  // lanes may start to slide: draw() reads them again
    const view = this.view, cd = view.cycleDistance, svg = this.svg;
    // Computed styles are read only for pieces whose flow, colours or lane changed: after the readings went in,
    // the first such read makes the browser restyle the whole picture, which on a tablet took ~350 ms every poll
    // and stalled the animation.
    const shared = [cd, [...svg.classList].filter((c) => !TRANSIENT.has(c)).join(" "),
      view.colorKeys.map((k) => svg.style.getPropertyValue(k)).join()].join("|");
    let changed = !this.canvas.isConnected;
    for (const piece of this.pieces) {
      const flow = piece.flow, way = flow.dataset.flow;
      const key = [shared, way, flow.getAttribute("style"), piece.line?.getAttribute("class"), piece.line?.getAttribute("style")].join("|");
      if (key === piece.key) continue;
      piece.key = key;
      changed = true;
      let shown = way !== "off" && !!cd;
      for (let el = piece.group; shown && el && el !== this.svg; el = el.parentNode) if (getComputedStyle(el).display === "none") shown = false;
      piece.shown = shown;
      if (!shown) continue;
      if (!piece.measured) this.measure(piece);
      const turns = Number(flow.style.getPropertyValue("--ef-turns")) || 1;
      piece.lead = way === "in" ? 0 : 1;
      piece.direction = way === "in" ? 1 : -1;
      piece.period = cd * turns;
      // Read --ef-junction and stroke from piece.group (never display:none), not piece.dashes[0] (hidden by .ef-gl).
      const gs = getComputedStyle(piece.group);
      piece.fixed = -(parseFloat(gs.getPropertyValue("--ef-junction")) || 0)
        + (Number(flow.style.getPropertyValue("--ef-turn")) || 0) * cd;
      piece.color = this.rgb(gs.stroke);
      piece.matrix = this.toPicture(piece.group);
      if (!piece.matrix) piece.shown = false;
      // taken where the lane is now, which may be the start of its slide: drawn frames take it again (below)
      piece.moving = true;
    }
    if (!this.canvas.isConnected) {
      const host = this.svg.parentNode;
      positioned(host);
      positioned(this.svg);
      this.svg.after(this.canvas);  // over the picture
      this.resizer?.observe(this.svg);
    }
    this.hasShown = this.pieces.some((p) => p.shown);
    this.svg.classList.remove("ef-no-gl");
    this.svg.classList.add("ef-gl");
    if (changed) this.place();
    this.scheduleMasks();
    this.sync();
  }

  rgb(color) {
    this.ink ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    const g = this.ink;
    g.clearRect(0, 0, 1, 1);
    g.fillStyle = "#000";
    g.fillStyle = color;
    g.fillRect(0, 0, 1, 1);
    const [r, gr, b] = g.getImageData(0, 0, 1, 1).data;
    return [r / 255, gr / 255, b / 255];
  }

  place() {
    if (this.failed || !this.canvas.isConnected) return;
    const maxWidth = LEVELS[this.view.level]?.maxWidth ?? 2048;
    const size = fitCanvas(this.canvas, this.svg, this.view.densityCap, maxWidth);
    if (!size || !size.w || !size.h || (size.w === this.width && size.h === this.height)) return;
    this.width = size.w;
    this.height = size.h;
    if (this.worker) this.worker.postMessage({ type: "resize", ...size });
    else this.painter.resize(size.w, size.h);
    this.maskKey = null;
    this.scheduleMasks();
    if (this.ready) this.draw(performance.now());
  }

  // The masks: for each depth, the alpha of everything the svg draws over its pulses (except other pulses, rain,
  // snow and the labels, which never cover a pipe), over the area the pulses can reach. Drawn again only when an
  // occluder changes (theme, parts, shutter, fog or canvas size); never on a timer.
  scheduleMasks() {
    const svg = this.svg;
    const fog = svg.getAttribute("data-weather") === "fog";
    const occluders = ["ef-light", "ef-no-solar", "ef-no-b1", "ef-no-b2", "ef-garage-open"]
      .filter((c) => svg.classList.contains(c)).join(" ");
    const key = `${occluders}|${fog}|${this.width}`;
    if (key === this.maskKey) return;
    this.maskKey = key;
    // One redraw waits or runs at a time and draws the picture as it is when it runs: readings coming in meanwhile
    // (Home Assistant sends one for every state change in the house) do not put it off; one during a run asks for
    // one more after it.
    if (this.maskBusy) { this.maskAgain = true; return; }
    if (this.maskTimer) return;
    this.maskTimer = setTimeout(async () => {
      this.maskTimer = 0;
      this.maskBusy = true;
      try { await this.drawMasks(); } catch { this.destroy(); return; } finally { this.maskBusy = false; }
      if (this.maskAgain) { this.maskAgain = false; this.maskKey = null; this.scheduleMasks(); }
    }, this.ready ? MASK_WAIT : 0);
  }

  async drawMasks() {
    if (this.failed || !this.width) return;
    const run = this.maskRun = (this.maskRun || 0) + 1;  // a later run supersedes this one
    const low = this.svg.classList.contains("ef-low");
    const box = PULSE_BOX, scale = Math.min(this.width, low ? 512 : 2048) / 1170;
    const width = Math.max(1, Math.round(box[2] * scale)), height = Math.max(1, Math.round(box[3] * scale));
    // One copy of the picture serves every depth (a copy each was a lot of memory on a small device). The depths
    // come in the picture's own order, so each drops all that the one before dropped and more: the copy is stripped
    // further for each. What goes is settled from the elements' places in the whole copy, taken before any is gone.
    const clone = this.svg.cloneNode(true);
    clone.classList.remove("ef-baked", "ef-gl", "ef-no-gl", "ef-paused", "ef-still");
    clone.classList.add("ef-masking");  // parts drawn only to fade the pulses (the grid pipe's end in light mode)
    clone.style.removeProperty("position");
    clone.setAttribute("viewBox", box.join(" "));
    clone.setAttribute("width", width);
    clone.setAttribute("height", height);
    const live = [...this.svg.querySelectorAll("*")], all = [...clone.querySelectorAll("*")];
    const defs = clone.querySelector("defs");
    const used = new Set([...clone.querySelectorAll("use")].map((u) => u.getAttribute("href")?.slice(1)));
    const kept = all.map((el) => !!el.closest("defs, clipPath, mask, linearGradient, radialGradient, filter, pattern, style"));
    const fog = this.svg.getAttribute("data-weather") === "fog";
    // what never covers a pipe: pipe bodies, pulses, weather particles, labels, reflections, frost, seasonal lights,
    // procedural grain overlays, and soft blurred shadows
    const neverSel = ".ef-flow, .ef-pulse, .ef-lane, .ef-line .ef-pipe-shade, #ef-rain, #ef-snow, #ef-labels, .ef-lead, #ef-flash, "
      + ".ef-frost, .ef-xmas, .ef-reflection, .ef-garage-spill, .ef-pane-spill, #ef-window-spill, #ef-b1-spill, #ef-b2-spill, .ef-tap, "
      + '[fill="url(#ef-stucco-relief)"], [fill="url(#ef-render-grain)"], [fill="url(#ef-polished-grain)"], '
      + '[filter="url(#ef-wall-shadow)"], [filter="url(#ef-eave-penumbra)"], [filter="url(#ef-ao-blur)"], [filter="url(#ef-rim-shadow)"], '
      + '[filter="url(#ef-contact-shadow)"], [filter="url(#ef-car-fall-blur)"], [filter="url(#ef-car-shade-blur)"], [filter="url(#ef-car-touch)"], '
      + '[filter="url(#ef-pane-inner-shade)"]' + (fog ? "" : ", #ef-fog");
    const never = all.map((el) => el.matches(neverSel));
    const pulse = all.map((el) => el.matches(".ef-flow, .ef-pulse"));
    const firsts = this.levels.map((level) => {
      const at = live.indexOf(level.first), holders = new Set();
      for (let el = all[at]; el; el = el.parentNode) holders.add(el);
      return { at, holders };
    });
    // Masks only need crisp alpha silhouettes: stripping filters, noise patterns and unused pulse templates makes
    // mask rasterization an order of magnitude faster without changing what covers the pipes.
    for (const el of clone.querySelectorAll("filter, #ef-house-pulse, #ef-stucco-relief, #ef-render-grain, #ef-polished-grain")) el.remove();
    for (const el of clone.querySelectorAll("[filter]")) el.removeAttribute("filter");
    const noFx = document.createElementNS("http://www.w3.org/2000/svg", "style");
    noFx.textContent = "*{filter:none!important;animation:none!important}";
    defs.append(noFx);
    const gone = new Set(), jobs = [];
    const ser = new XMLSerializer();
    for (const [n, level] of this.levels.entries()) {
      const { at, holders } = firsts[n];
      all.forEach((el, i) => {
        if (kept[i] || gone.has(el)) return;
        // before the pulses (and not holding any of them), or pulses themselves, or what never covers a pipe
        if (!((i < at && !holders.has(el)) || i === at || never[i])) return;
        gone.add(el);
        // something a later <use> draws stays, out of sight in <defs>
        if (el.id && used.has(el.id) && !pulse[i]) defs.append(el); else el.remove();
      });
      if (!clone.querySelector("#ef-scene :is(path,rect,circle,ellipse,polygon,polyline,line,use)")) {
        this.uploadMask(level.id, null);
        continue;
      }
      jobs.push({ level, markup: ser.serializeToString(clone) });
    }
    // Decode and upload depth masks two at a time: faster than sequential without spiking peak RAM on small iPhones.
    for (let i = 0; i < jobs.length; i += 2) {
      const batch = await Promise.all(jobs.slice(i, i + 2).map(async ({ level, markup }) => {
        const url = URL.createObjectURL(new Blob([markup], { type: "image/svg+xml" }));
        const image = new Image();
        let source = image;
        try {
          image.src = url;
          await image.decode();
          if (typeof createImageBitmap === "function") source = await createImageBitmap(image).catch(() => image);
          return { level, source };
        } finally {
          URL.revokeObjectURL(url);
          if (source !== image) releaseImage(image);  // the bitmap has its pixels; else it is uploaded as it is
        }
      }));
      if (this.failed || run !== this.maskRun) {
        for (const { source } of batch) { source.close?.(); releaseImage(source); }
        return;
      }
      for (const { level, source } of batch) {
        if (this.worker && !(source instanceof ImageBitmap)) { this.workerFallback(); return; }
        this.uploadMask(level.id, source);
      }
    }
    if (!this.ready) {
      this.ready = true;
      this.canvas.style.visibility = "inherit";
      this.svg.classList.add("ef-gl");
    }
    this.draw(performance.now());
    this.sync();
  }

  uploadMask(id, image) {
    if (this.worker) this.worker.postMessage({ type: "mask", id, image }, image ? [image] : []);
    else {
      this.painter.mask(id, image);
      image?.close?.();
      releaseImage(image);
    }
  }

  // The next frame: at once on high, else after a pause (a timer, so the page is not woken every screen refresh).
  next(drawnAt) {
    if (this.raf || this.wait) return;
    const fps = LEVELS[this.view.level]?.fps ?? Infinity;
    if (!Number.isFinite(fps)) { this.raf = requestAnimationFrame(this.frame); return; }
    const spent = drawnAt ? Math.max(0, performance.now() - drawnAt) : 0;
    this.wait = setTimeout(() => { this.wait = 0; this.raf = requestAnimationFrame(this.frame); }, Math.max(0, 1000 / fps - spent - 10));
  }

  stopFrames() {
    cancelAnimationFrame(this.raf);
    clearTimeout(this.wait);
    this.raf = this.wait = 0;
  }

  sync() {
    if (!this.ready) return;
    if (this.worker) { this.draw(performance.now()); return; }
    if (this.view.pulsesRun() && this.hasShown) this.next();
    else { this.stopFrames(); this.draw(performance.now()); }
  }

  destroy() {
    if (this.dead) return;  // once: a lost context fires again on a renderer already gone
    this.dead = true;
    this.stopFrames();
    clearTimeout(this.maskTimer);
    this.failed = true;
    this.worker?.terminate();
    this.painter?.gl?.getExtension("WEBGL_lose_context")?.loseContext();
    this.svg.classList.remove("ef-gl");  // the svg's own pulses again, started in step
    this.svg.classList.add("ef-no-gl");
    this.view.syncFallbackDashes();
    this.view.restartBeats();
    this.view.flushBeats();
    this.view.alignBeats();
    this.resizer?.disconnect();
    this.canvas.remove();
  }

  draw(now) {
    if (!this.ready || this.failed) return;
    const view = this.view, pieces = [];
    let sliding = false;
    // Each lane's [moving, opacity], read once after a reading and then only while it slides: a style read every
    // frame made the browser bring the picture's styles up to date every frame.
    const lines = this.lineStates ??= new Map();
    for (const piece of this.pieces) {
      if (!piece.shown) continue;
      let alpha = 1;
      if (piece.line) {
        // a lane that comes or goes fades and slides (CSS transitions): follow it while it moves, and once more
        // after a reading, as a slide that ran while no frames were drawn (tab in the background) is over by now
        if (!lines.has(piece.line) || lines.get(piece.line)[0]) {
          const ls = getComputedStyle(piece.line);
          lines.set(piece.line, [piece.line.getAnimations?.().length > 0, ls.visibility === "hidden" ? 0 : parseFloat(ls.opacity)]);
        }
        const [moving, opacity] = lines.get(piece.line);
        if (moving || piece.moving) piece.matrix = this.toPicture(piece.group) || piece.matrix;
        piece.moving = moving;
        sliding ||= moving;
        alpha = opacity;
        if (!alpha) continue;
      }
      const m = piece.matrix;
      pieces.push({ id: piece.id, level: piece.level.id, matrix: [m.a, m.b, 0, m.c, m.d, 0, m.e, m.f, 1],
        alpha, color: piece.color, lead: piece.lead, direction: piece.direction, period: piece.period, fixed: piece.fixed, clip: piece.clip });
    }
    if (this.worker) {
      const run = view.pulsesRun() && this.hasShown;
      this.worker.postMessage({ type: "scene", pieces, origin: performance.timeOrigin + view.beatStart,
        fps: run ? LEVELS[view.level].fps : 0 });
      // Only a sliding SVG lane needs fresh DOM measurements between readings.
      if (sliding && run && !this.raf) this.raf = requestAnimationFrame(this.frame);
    } else this.painter.paint(pieces, (now - view.beatStart) * PULSE_SPEED / 1000);
  }
}

// Detail. With "auto" the view watches how evenly the picture moves while it is on screen. Where frames keep
// dropping, the GPU canvases first draw at a lower density (hard to see on a sharp screen); if that is not enough,
// the card asks which level of detail to use, trying each one out as it is picked. The lower density and the
// answer are remembered on the device. "high", "medium" and "low" fix the level for every device.
const EFFECTS = ["auto", "high", "medium", "low"];
const LEVELS = {
  // fps: how often the pulse layer draws. The pulses move slowly, and each frame costs a phone's GPU and battery.
  high: { cap: Infinity, maxWidth: 2048, shimmer: true, fps: Infinity, label: "High" },
  medium: { cap: 1.5, maxWidth: 1280, shimmer: false, fps: 30, label: "Medium" },
  low: { cap: 1, maxWidth: 640, shimmer: false, fps: 30, label: "Low" },
};
const OLD_EFFECTS = { full: "high", reduced: "low" };  // the names in 0.4.0
const effectsLevel = (value) => OLD_EFFECTS[value] ?? (EFFECTS.includes(value) ? value : "auto");
const EFFECTS_KEY = "energy-flow-card.effects";
const WATCH_TIME = 60000;  // ms of moving picture per verdict
const LOW_DENSITY = 1.5;
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

// Where the system's Reduce Motion switch lives, for the hint shown while it keeps the pulses still.
function motionSettingsPath(userAgent = "", platform = "", touchPoints = 0) {
  if (/iPhone|iPad|iPod/.test(userAgent) || (platform === "MacIntel" && touchPoints > 1)) {
    return "Settings → Accessibility → Motion → Reduce Motion";  // iPadOS reports itself as a Mac
  }
  if (/Android/.test(userAgent)) return "Settings → Accessibility → Remove animations";
  if (/Mac/.test(platform) || /Macintosh/.test(userAgent)) return "System Settings → Accessibility → Display → Reduce motion";
  if (/Win/.test(platform) || /Windows/.test(userAgent)) return "Settings → Accessibility → Visual effects → Animation effects";
  return "";
}
function remembered() {
  try { return JSON.parse(localStorage.getItem(EFFECTS_KEY)) || {}; } catch { return {}; }
}
function remember(patch) {
  try { localStorage.setItem(EFFECTS_KEY, JSON.stringify({ ...remembered(), ...patch })); } catch { /* private mode */ }
  dispatchEvent(new Event(EFFECTS_KEY));  // every card on the page follows
}

// Whether frame times show a struggling page. The screen's own frame time is taken from the quickest frames, so a
// browser that caps the page at 30 fps (iPhone Low Power Mode) reads as smooth while it is even; what counts is
// time lost to frames that came late.
function choppy(times) {
  if (times.length < 30) return false;
  const sorted = [...times].sort((a, b) => a - b);
  const base = sorted[Math.floor(sorted.length * .1)];
  let lost = 0, total = 0;
  for (const t of times) { total += t; if (t > base * 1.7) lost += t - base; }
  return base > 45 || lost / total > .2;
}

class FrameWatch {
  constructor(verdict) {
    this.verdict = verdict;
    this.raf = 0;
    this.reset();
    this.frame = (now) => {
      this.raf = requestAnimationFrame(this.frame);
      const dt = now - this.last;
      if (this.last && dt < 1000) { this.times.push(dt); this.total += dt; }  // not the gap after a pause
      this.last = now;
      if (this.total >= WATCH_TIME) { const poor = choppy(this.times); this.reset(); this.verdict(poor); }
    };
  }
  reset() { this.times = []; this.total = 0; this.last = 0; }
  start() { if (!this.raf) { this.last = 0; this.raf = requestAnimationFrame(this.frame); } }
  stop() { cancelAnimationFrame(this.raf); this.raf = 0; }
}

class EnergyFlowView {
  constructor(container, svgText, pulseProfile, pulseWorkerSource) {
    this.pulseWorkerSource = pulseWorkerSource;
    this.pulseProfile = pulseProfile;
    container.innerHTML = svgText;
    this.svg = container.querySelector("svg");
    this.cfg = DEFAULTS;
    this.cadenceRoutes = [];
    this.cycleDistance = 0;
    this.beatStart = 0;
    this.gridTurns = 0;
    this.colorKeys = [];
    this.seen = true;
    this.densityCap = Infinity;
    this.level = "high";
    this.chosen = null;  // the level picked in the config or by the viewer on this device
    this.trial = null;   // the level being tried out in the question
    this.fine = 0;
    this.watch = new FrameWatch((poor) => this.frameVerdict(poor));
    this.onEffects = () => { this.applyEffects(); this.motionHint(); };
    addEventListener(EFFECTS_KEY, this.onEffects);

    const svg = this.svg;
    // Flows drawn as <use> copies of a shared pulse (the house lanes) become real copies, so that every dash is an
    // element of its own that the pulse renderer can measure.
    for (const use of [...svg.querySelectorAll("use.ef-flow")]) {
      const flow = document.createElementNS("http://www.w3.org/2000/svg", "g");
      for (const { name, value } of use.attributes) if (name !== "href") flow.setAttribute(name, value);
      const pulse = this.part(use.getAttribute("href").slice(1)).cloneNode(true);
      pulse.removeAttribute("id");
      flow.append(pulse);
      use.replaceWith(flow);
    }
    for (const lane of svg.querySelectorAll("[data-route]")) {
      // The grid can carry several pulses. It follows the beat set by the shorter wires.
      if (lane.id.startsWith("ef-f-grid")) continue;
      const length = this.part(lane.dataset.route).getTotalLength();
      const junctionEnd = lane.hasAttribute("data-junction-end");
      if (junctionEnd) lane.style.setProperty("--ef-junction", length);
      // Parts of a pulse drawn in their own frame start part-way along the route.
      for (const piece of lane.querySelectorAll("[data-junction-shift]")) {
        piece.style.setProperty("--ef-junction", length + Number(piece.dataset.junctionShift));
      }
      this.cadenceRoutes.push({ lane, length, junctionEnd });
    }
    svg.classList.add("ef-still");  // the first readings go in as they are; lanes animate only on later changes

    // Nothing moves while the picture is off the screen or the page is in the background.
    this.onVisibility = () => this.restWhenUnseen();
    document.addEventListener("visibilitychange", this.onVisibility);
    if (typeof IntersectionObserver === "function") {
      this.observer = new IntersectionObserver(([entry]) => { this.seen = entry.isIntersecting; this.restWhenUnseen(); });
      this.observer.observe(svg);
    }

    // The system's Reduce Motion stops the pulses; switched while the page is open, they follow.
    this.motion = matchMedia(REDUCED_MOTION);
    this.onMotion = () => {
      this.restWhenUnseen();
      if ("celsius" in this) this.temperature(this.celsius);
      this.motionHint();
    };
    this.motion.addEventListener?.("change", this.onMotion);
    this.motionHint();
  }

  // Off the page (Home Assistant keeps cards it may show again): everything pauses, and the page's events stop
  // holding on to the picture, so a card that is thrown away can go, GPU contexts and all. resume() carries on with
  // the same renderers.
  suspend() {
    if (this.suspended) return;
    this.suspended = true;
    clearTimeout(this.reflectionTimer);
    this.lastSkyWeather = null;
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.observer?.disconnect();
    removeEventListener(EFFECTS_KEY, this.onEffects);
    this.motion.removeEventListener?.("change", this.onMotion);
    this.watch.stop();
    this.paused = true;
    this.syncAnimations();
    this.shimmer?.sync();
    this.pulses?.sync();
  }

  resume() {
    if (!this.suspended) return;
    this.suspended = false;
    document.addEventListener("visibilitychange", this.onVisibility);
    this.observer?.observe(this.svg);
    addEventListener(EFFECTS_KEY, this.onEffects);
    this.motion.addEventListener?.("change", this.onMotion);
    this.applyEffects();
    this.restWhenUnseen();  // pauses again only if off screen or hidden
    this.motionHint();
  }

  destroy() {
    clearTimeout(this.reflectionTimer);
    clearTimeout(this.garageMoving);
    clearTimeout(this.relabel);
    clearTimeout(this.settle);
    for (const timer of Object.values(this.goneTimers || {})) clearTimeout(timer);
    document.removeEventListener("visibilitychange", this.onVisibility);
    this.observer?.disconnect();
    removeEventListener(EFFECTS_KEY, this.onEffects);
    this.motion.removeEventListener?.("change", this.onMotion);
    this.watch.stop();
    this.offer?.remove();
    this.hint?.remove();
    this.shimmer?.destroy();
    this.pulses?.destroy();
  }

  // Whether anything in the picture may move now.
  pulsesRun() {
    return !this.paused && !matchMedia(REDUCED_MOTION).matches;
  }

  // Pauses or resumes the picture's own CSS animations through the Web Animations API. A class on the svg with a
  // rule for every element did this before, and toggling it restyled the whole picture (30-60 ms on a fast PC, far
  // more on a tablet) each time the card scrolled in or out of view (issue #3). force: also animations started since.
  syncAnimations(force = false) {
    const run = this.pulsesRun();
    if (!force && run === this.animationsRun) return;
    this.animationsRun = run;
    // Without the API, the old rule on every element (slow to switch, but nothing keeps running off screen).
    if (!this.svg.getAnimations) { this.svg.classList.toggle("ef-paused", !run); return; }
    // Only the ones it paused are played again (play() would start a finished one over), and without a look at
    // playState: reading it settles the styles again for each animation in turn (30 ms).
    if (run) {
      // only those still there: CSS cancels one whose rule went while it rested (the stars when rain came)
      if (this.held) for (const a of this.svg.getAnimations({ subtree: true })) if (this.held.has(a)) a.play();
      this.held = null;
      return;
    }
    this.held ??= new Set();
    for (const a of this.svg.getAnimations({ subtree: true })) {
      if (!a.animationName || this.held.has(a)) continue;  // CSS animations only: transitions finish as they would
      a.pause();
      this.held.add(a);
    }
  }

  part(id) { return this.svg.getElementById(id); }

  // Writes only real changes: parts of the picture are mirrored by <use> copies, which the browser rebuilds
  // (restarting their animations) on every attribute write, even one that sets the same value.
  attr(el, name, value) { value = String(value); if (el.getAttribute(name) !== value) el.setAttribute(name, value); }

  text(id, value, idle = false) {
    const el = this.part(id);
    if (el.textContent !== value) el.textContent = value;
    if (idle !== null) el.classList.toggle("ef-idle", idle);
  }

  // Names, colours and which parts are there. Takes the card's config, filled in from DEFAULTS.
  configure(cfg) {
    this.cfg = cfg;
    const svg = this.svg;
    svg.classList.toggle("ef-no-solar", !cfg.solar.show);
    svg.classList.toggle("ef-no-b1", !cfg.battery1.show);
    svg.classList.toggle("ef-no-b2", !cfg.battery2.show);
    svg.classList.toggle("ef-light", !!cfg.light);  // changes seldom: restyling the whole picture once is fine
    this.placeLabels(cfg.battery1.show && cfg.battery2.show);
    const name = (id, value) => this.text(id, String(value ?? "").toUpperCase(), null);
    name("ef-solar-name", cfg.solar.name);
    name("ef-home-name", cfg.home.name);
    name("ef-ev-name", cfg.ev.name);
    name("ef-grid-name", cfg.grid.name);
    name("ef-b1-name", cfg.battery1.name);
    name("ef-b2-name", cfg.battery2.name);
    const vars = colorVars(cfg);
    for (const key of this.colorKeys) if (!(key in vars)) svg.style.removeProperty(key);
    for (const [key, value] of Object.entries(vars)) svg.style.setProperty(key, value);
    this.colorKeys = Object.keys(vars);
    this.colors = {
      solar: cfg.solar.color, grid: themed(cfg, "grid", "color"), b1: cfg.battery1.color, b2: cfg.battery2.color, ev: cfg.ev.color,
    };
    this.alignLabels();  // names change the widths
    this.applyEffects();
    // The editor sends the config again on every keystroke, and each snapshot of the picture costs a small device
    // dearly: after the first config they are taken again only once the changes stop coming.
    clearTimeout(this.settle);
    if (this.configured) this.settle = setTimeout(() => this.resample(), CONFIG_SETTLE);
    else { this.configured = true; this.resample(); }
  }

  // The shimmer's snapshot of the still parts again, after new names or colours.
  resample() {
    this.shimmer?.invalidate();
    if (this.svg.classList.contains("ef-hot")) this.shimmer?.refresh();
  }

  // Thrown away (off the page for good): the GPU contexts go now, not when the browser gets round to collecting
  // them. Should the picture come back after all, the renderers are made again with the next readings.
  release() {
    clearTimeout(this.settle);
    this.shimmer?.destroy();
    this.shimmer = null;
    this.pulses?.destroy();
    this.pulses = null;
  }

  // Two batteries share the bottom row: battery 1 right of its leader, battery 2 and the grid left of theirs.
  // With one battery or none there is room, so each label is centred on its leader, as solar and home are.
  // The texts stay where they are drawn and slide (a transform, so it can animate) to their centres; the slide
  // animates only when the layout changes, not when a reading changes a label's width.
  placeLabels(both) {
    this.labelPlaces ??= [...this.svg.querySelectorAll("#ef-b1-label text, #ef-b2-label text, #ef-grid-name, #ef-grid")]
      .map((el) => ({ el, x: Number(el.getAttribute("x")), anchor: el.getAttribute("text-anchor") || "start",
        centre: el.closest("#ef-b1-label") ? 388 : el.closest("#ef-b2-label") ? 495 : 895 }));
    if (this.bothBatteries !== undefined && this.bothBatteries !== both && !this.svg.classList.contains("ef-still")) {
      this.svg.classList.add("ef-relabel");
      clearTimeout(this.relabel);
      this.relabel = setTimeout(() => { this.svg.classList.remove("ef-relabel"); this.restAgain(); }, 700);
    }
    this.bothBatteries = both;
    this.alignLabels();
  }

  alignLabels() {
    for (const place of this.labelPlaces || []) {
      const { el, x, anchor, centre } = place;
      let shift = 0;
      if (!this.bothBatteries) {
        const w = el.getClientRects().length ? el.getBBox().width : 0;
        shift = anchor === "end" ? centre + w / 2 - x : anchor === "middle" ? centre - x : centre - w / 2 - x;
      }
      shift = Math.round(shift * 10) / 10;
      if (place.shift === shift) continue;
      place.shift = shift;
      el.style.transform = shift ? `translateX(${shift}px)` : "";
    }
  }

  applyEffects() {
    const kept = remembered(), mode = effectsLevel(this.cfg.effects);
    this.chosen = mode !== "auto" ? mode : kept.level ?? OLD_EFFECTS[kept.choice] ?? null;
    if (this.chosen) this.closeOffer();
    const level = this.trial ?? this.chosen;
    this.setLevel(level ?? "high", level ? 0 : kept.density);
    this.watchFrames();
  }

  // density: the lower density "auto" settled on before asking, if any
  setLevel(level, density) {
    const prev = this.level;
    this.level = level;
    const changeRenderer = this.pulses && prev !== level && (level === "low" || prev === "low")
      && !this.workerFailed && typeof Worker === "function" && typeof createImageBitmap === "function"
      && typeof HTMLCanvasElement.prototype.transferControlToOffscreen === "function";
    const cap = level === "high" && density ? density : LEVELS[level].cap;
    this.svg.classList.toggle("ef-lite", level !== "high");
    this.svg.classList.toggle("ef-low", level === "low");
    if (cap !== this.densityCap || prev !== level) {
      this.densityCap = cap;
      this.shimmer?.place();
      if (changeRenderer) {
        this.pulses.destroy();
        this.pulses = null;
        if (this.svg.isConnected && !this.suspended) this.updatePulses();
      } else this.pulses?.place();
    }
    this.syncFallbackDashes();
    if ("celsius" in this) this.temperature(this.celsius);
  }

  // Materialize the full stack only for the higher-detail SVG fallback. The GPU uses the shared profile.
  syncFallbackDashes() {
    const full = !this.suspended && this.level !== "low" && this.svg.classList.contains("ef-no-gl");
    if (full === !!this.fullDashes) return;
    this.fullDashes = full;
    for (const seed of this.svg.querySelectorAll(".ef-flow .ef-p10")) {
      const parent = seed.parentNode;
      if (full) {
        const retained = [...parent.querySelectorAll(".ef-pulse")];
        let next = 0;
        for (let n = 1; n <= this.pulseProfile.lengths.length; n++) {
          if (retained[next]?.classList.contains(`ef-p${n}`)) { next++; continue; }
          const dash = seed.cloneNode(false);
          dash.setAttribute("class", `ef-pulse ef-p${n}`);
          parent.insertBefore(dash, retained[next] || null);
        }
      } else {
        for (const dash of parent.querySelectorAll(".ef-pulse:not(.ef-p10):not(.ef-p25):not(.ef-p40):not(.ef-p51)")) dash.remove();
      }
    }
  }

  // Watched only while there is something to judge and nothing chosen yet.
  watchFrames() {
    const on = !this.chosen && !this.offer && this.fine < 3 && this.pulsesRun();
    if (on) this.watch.start();
    else this.watch.stop();
  }

  frameVerdict(poor) {
    if (!poor) { this.fine++; this.watchFrames(); return; }
    this.fine = 0;
    if ((devicePixelRatio || 1) > LOW_DENSITY && !(this.densityCap <= LOW_DENSITY)) remember({ density: LOW_DENSITY });
    else this.offerLevels();
  }

  // The question: three levels of detail, each tried on the picture as it is picked, kept with OK.
  offerLevels() {
    if (this.offer || this.chosen) return;
    const el = (tag, css, text) => {
      const e = document.createElement(tag);
      if (css) e.style.cssText = css;
      if (text) e.textContent = text;
      return e;
    };
    const offer = this.offer = el("div", "position:absolute;left:50%;top:10px;transform:translateX(-50%);z-index:2;"
      + "width:max-content;max-width:calc(100% - 20px);box-sizing:border-box;padding:9px 10px 9px 14px;border-radius:14px;"
      + "background:rgba(18,19,21,.92);color:#f1f1f1;font:13px/1.3 system-ui,-apple-system,sans-serif;"
      + "text-align:left;box-shadow:0 3px 14px rgba(0,0,0,.45)");
    offer.setAttribute("role", "dialog");
    offer.setAttribute("aria-label", "Animation detail");
    offer.append(el("div", "margin:0 0 6px", "Animation looks choppy. Try less detail?"));
    const row = el("div", "display:flex;align-items:center;gap:12px;white-space:nowrap");
    const name = "ef-detail-" + Math.random().toString(36).slice(2);
    for (const level of ["high", "medium", "low"]) {
      const option = el("label", "display:flex;align-items:center;gap:5px;cursor:pointer");
      const radio = el("input", "margin:0;accent-color:#f1f1f1;width:15px;height:15px");
      Object.assign(radio, { type: "radio", name, value: level, checked: level === "medium" });
      option.append(radio, LEVELS[level].label);
      row.append(option);
    }
    const ok = el("button", "margin-left:4px;border:0;border-radius:12px;padding:5px 16px;"
      + "font:inherit;font-weight:600;cursor:pointer;background:#f1f1f1;color:#111", "OK");
    ok.type = "button";
    row.append(ok);
    offer.append(row);
    // its own taps: not a tap on the picture
    for (const type of ["click", "pointerdown", "pointerup", "mousedown", "mouseup", "touchstart", "touchend"]) {
      offer.addEventListener(type, (e) => e.stopPropagation());
    }
    offer.addEventListener("change", (e) => { this.trial = e.target.value; this.applyEffects(); });
    ok.addEventListener("click", () => {
      const level = this.trial;
      this.closeOffer();
      remember({ level });
    });
    const host = this.svg.parentNode;
    positioned(host);
    host.append(offer);
    this.trial = "medium";
    this.applyEffects();
  }

  closeOffer() {
    this.offer?.remove();
    this.offer = null;
    this.trial = null;
  }

  // While the system asks for reduced motion the pulses stand still, which looks broken unless it is said why.
  // Shown until it is dismissed on this device (every card on the page follows) or Reduce Motion is switched off.
  motionHint() {
    const wanted = this.motion?.matches && !remembered().motionHintSeen;
    if (!wanted) { this.hint?.remove(); this.hint = null; return; }
    if (this.hint) return;
    const hint = this.hint = document.createElement("div");
    hint.style.cssText = "position:absolute;left:50%;bottom:10px;transform:translateX(-50%);z-index:2;"
      + "width:max-content;max-width:calc(100% - 20px);box-sizing:border-box;padding:9px 10px 9px 14px;border-radius:14px;"
      + "background:rgba(18,19,21,.92);color:#f1f1f1;font:13px/1.35 system-ui,-apple-system,sans-serif;"
      + "text-align:left;box-shadow:0 3px 14px rgba(0,0,0,.45);display:flex;align-items:center;gap:12px";
    hint.setAttribute("role", "note");
    const text = document.createElement("div");
    const path = motionSettingsPath(navigator.userAgent, navigator.platform, navigator.maxTouchPoints);
    const where = document.createElement("b");
    where.textContent = path || "your device's accessibility settings";
    where.style.fontWeight = "600";
    text.append("Energy pulses are paused because Reduce Motion is on. To see them move, turn it off in ", where, ".");
    const ok = document.createElement("button");
    ok.type = "button";
    ok.textContent = "Got it";
    ok.style.cssText = "flex:none;border:0;border-radius:12px;padding:5px 14px;font:inherit;font-weight:600;"
      + "cursor:pointer;background:#f1f1f1;color:#111";
    hint.append(text, ok);
    // its own taps: not a tap on the picture
    for (const type of ["click", "pointerdown", "pointerup", "mousedown", "mouseup", "touchstart", "touchend"]) {
      hint.addEventListener(type, (e) => e.stopPropagation());
    }
    ok.addEventListener("click", () => remember({ motionHintSeen: true }));
    const host = this.svg.parentNode;
    positioned(host);
    host.append(hint);
  }

  // A battery's line: power, which way it flows (▼ out of the battery, ▲ into it) and its charge.
  battery(key, watts, soc) {
    const w = flow(watts);
    this.text(`ef-${key}`, kw(watts), !w);
    const dir = this.part(`ef-${key}-dir`);
    const arrow = w < 0 ? "▲" : "▼";
    if (dir.textContent !== arrow) dir.textContent = arrow;
    this.attr(dir, "fill-opacity", w ? 1 : 0);  // kept in the line, so the numbers don't jump sideways
    this.text(`ef-${key}-soc`, missing(soc) ? "–" : `${Math.round(soc)}%`, null);
    // The lit strip on the battery's side is as tall as its charge.
    const strip = this.part(`ef-${key}-level`);
    const [backFoot, frontFoot, frontTop, backTop] = strip.dataset.full.split(" ").map((p) => p.split(",").map(Number));
    const share = Math.max(0, Math.min(1, (soc ?? 0) / 100));
    const up = (a, b) => `${(a[0] + (b[0] - a[0]) * share).toFixed(1)},${(a[1] + (b[1] - a[1]) * share).toFixed(1)}`;
    this.attr(strip, "points", `${backFoot} ${frontFoot} ${up(frontFoot, frontTop)} ${up(backFoot, backTop)}`);
  }

  // A lane's moving pulse: "out" runs away from the source (towards the house), "in" back into it; none = idle.
  pulse(lane, way, color) {
    const el = this.part(`ef-f-${lane}`);
    this.attr(el, "data-flow", way || "off");
    if (color) el.style.setProperty("--ef-flow-color", color);
    else el.style.removeProperty("--ef-flow-color");
  }

  // A lane on the wall is there only while power runs in it. It fades and slides half a place as it comes and
  // goes (CSS transitions in the svg); `place` is how many lanes down from its drawn position it sits.
  // stay: the lane is drawn when idle too (the batteries'), with no pulses on it. withPulse false: the caller sets
  // the lane's pulses itself (turnLanes).
  line(lane, way, place = 0, color, stay = false, withPulse = true) {
    const el = this.part(`ef-l-${lane}`), gone = !way && !stay;
    el.classList.toggle("ef-gone", gone);
    el.style.transform = `translateY(${(gone ? place - 0.5 : place) * LANE_GAP}px)`;
    if (!gone && withPulse) this.pulse(lane, way, color);
    // A lane on its way out keeps its pulses while it fades, then they stop: hidden, they would still be animated
    // (and drawn, at no opacity, on the pulse layer).
    // Armed once as the lane goes, so readings coming in while it fades do not keep putting it off.
    this.goneTimers ??= {};
    if (!gone) {
      clearTimeout(this.goneTimers[lane]);
      delete this.goneTimers[lane];
    } else if (!this.goneTimers[lane] && this.part(`ef-f-${lane}`).dataset.flow !== "off") {
      this.goneTimers[lane] = setTimeout(() => {
        delete this.goneTimers[lane];
        if (!el.classList.contains("ef-gone")) return;
        this.pulse(lane, false);
        this.pulses?.update();
        this.restAgain();
      }, LANE_FADE);
    }
  }

  // The grid pipe's sources, [way, colour] each. Up to four share the one lane by taking turns: each flow carries
  // every n-th pulse (--ef-turns in the svg). A change in their number restarts the beat, as iOS Safari would
  // otherwise keep the old timing.
  gridLanes(flows) {
    GRID_FLOWS.forEach((name, i) => {
      const [way, color] = flows[i] || [];
      const el = this.part(`ef-f-${name}`);
      el.style.setProperty("--ef-turns", flows.length);
      el.style.setProperty("--ef-turn", i);
      this.pulse(name, i < flows.length && way, color);
    });
    if (flows.length === this.gridTurns) return;
    this.gridTurns = flows.length;
    this.restartBeats();
  }

  // A flow taking turns with others on one line: every `turns`-th pulse, shifted by `turn`.
  turnStyle(name, turns, turn) {
    const el = this.part(`ef-f-${name}`);
    if (turns > 1) { el.style.setProperty("--ef-turns", turns); el.style.setProperty("--ef-turn", turn); }
    else { el.style.removeProperty("--ef-turns"); el.style.removeProperty("--ef-turn"); }
  }

  // Something charged from several sources (the car, a battery): one flow per source (up to four), taking turns on
  // its line, in their colours.
  turnLanes(names, way, colors) {
    const flows = way ? colors.slice(0, names.length) : [];
    names.forEach((name, i) => {
      this.turnStyle(name, flows.length, i);
      this.pulse(name, i < Math.max(1, flows.length) && way, flows[i] || colors[0]);
    });
    this.turns ??= {};
    const turns = Math.max(1, flows.length);  // none or one: the same timing
    if (turns === this.turns[names[0]]) return;
    this.turns[names[0]] = turns;
    this.restartBeats();
  }

  updatePulseCadence() {
    let incoming = 0, outgoing = 0;
    for (const { lane, length, junctionEnd } of this.cadenceRoutes) {
      const way = lane.dataset.flow;
      if (way === "off" || lane.closest(".ef-gone")) continue;
      if ((way === "out") === junctionEnd) incoming = Math.max(incoming, length);
      else outgoing = Math.max(outgoing, length);
    }
    // The longest incoming run starts as the longest outgoing run finishes its trip.
    const distance = Math.max(SHORTEST_CYCLE, incoming + outgoing);
    if (distance === this.cycleDistance) return;
    const now = document.timeline?.currentTime ?? performance.now();
    // Keep the pulses where they are: the beat is PULSE_SPEED units a second since beatStart. Where it is within the
    // cycle stays, and so does which cycle it is, counted up to 12 (every turn count, 2 to 4, divides it), so a pipe
    // whose sources take turns does not jump to its first colour.
    if (this.cycleDistance) {
      const beat = (now - this.beatStart) * PULSE_SPEED / 1000, cycles = Math.floor(beat / this.cycleDistance) % 12;
      const kept = cycles * distance + (beat % this.cycleDistance) % distance;
      this.beatStart = now - kept * 1000 / PULSE_SPEED;
    }
    this.svg.style.setProperty("--ef-cycle-distance", distance);
    this.svg.style.setProperty("--ef-cycle-period", `${distance / PULSE_SPEED}s`);
    // Restarted, not just retimed: iOS Safari keeps a running animation's old duration and end value when the
    // custom properties behind them change.
    this.cycleDistance = distance;
    this.restartBeats();
  }

  // The svg's own beat animations start again (see updatePulseCadence): once per update, however many asked, and
  // not at all while the pulse layer draws the pulses (each restart restyles the whole picture).
  restartBeats() { this.beatsDirty = true; }

  flushBeats() {
    if (!this.beatsDirty) return;
    this.beatsDirty = false;
    if (this.svg.classList.contains("ef-gl")) return;
    this.svg.classList.add("ef-restart");
    this.svg.getBoundingClientRect();
    this.svg.classList.remove("ef-restart");
  }

  // Every wire runs its own beat animation (cheaper than one on the whole picture); they all take their time from
  // the one clock, so a wire that appears joins in step with the others.
  alignBeats() {
    if (this.svg.classList.contains("ef-gl")) return;
    if (!this.svg.getAnimations || !this.cycleDistance) return;
    const now = document.timeline?.currentTime ?? performance.now();
    for (const a of this.svg.getAnimations({ subtree: true })) {
      if (!a.animationName?.endsWith("-beat")) continue;
      // a flow taking turns (the grid pipe, the car's cable, a battery's pipe, a shared house line) has its own count
      const turns = a.animationName === "ef-grid-beat" ? Number(a.effect?.target?.style.getPropertyValue("--ef-turns")) || 1 : 1;
      a.currentTime = (now - this.beatStart) % (turns * this.cycleDistance * 1000 / PULSE_SPEED);
    }
  }

  light(name, body, brightness) {
    const el = this.part(`ef-${name}`);
    el.style.opacity = brightness;
    if (!body || !brightness) return;
    const height = Math.sin(Math.max(0, body.altitude) * Math.PI / 180);
    this.attr(el, "transform", `translate(${skyX(body.progress)} ${125 - height * 89})`);
  }

  panelReflection(name, body, reflection) {
    this.attr(this.part(`ef-${name}-shine`), "opacity", reflection);
    const coating = this.part(`ef-${name}-coating-glint`);
    const fold = this.part(`ef-${name}-fold-glint`);
    this.attr(coating, "opacity", Math.min(1, reflection * 1.28));
    this.attr(fold, "opacity", Math.min(1, reflection * 1.10));
    if (!body || !reflection) return;
    const height = Math.sin(Math.max(0, body.altitude) * Math.PI / 180);
    const bodyX = skyX(body.progress);
    // Project the moving light onto the inclined glass, then onto the lower metal fold.
    const glintX = bodyX + 117;
    const glassY = 610 - .202 * glintX - 49 * height;
    const foldX = glintX + 42;
    const foldY = 855 - .22334 * foldX;
    this.attr(coating, "transform", `translate(${glintX} ${glassY})`);
    this.attr(fold, "transform", `translate(${foldX} ${foldY})`);
    // Follow the front array's centre line, with the solar glint just to the right of the disc.
    const solar = name === "sun";
    const x = solar ? bodyX + 10 : bodyX;
    const y = 682.55 - .215 * x - 10 * height;
    const centre = `translate(${x} ${y})`;
    const softShape = "matrix(1 -.215 .33 .52 0 0)";
    const shape = solar ? `rotate(86) scale(.67 ${.16 + .05 * height})` : softShape;
    this.attr(this.part(`ef-${name}-reflection`), "gradientTransform", `${centre} ${shape}`);
    if (solar) this.attr(this.part("ef-sun-sheen"), "gradientTransform", `${centre} ${softShape}`);
  }

  updateSky(sky, weather) {
    const { sun, moon } = sky || {};
    const day = sun ? sun.altitude >= HORIZON : true;
    if (day) this.svg.removeAttribute("data-time");
    else this.attr(this.svg, "data-time", "night");

    const visibility = SKY_VISIBILITY[weather] || 0;
    const altitude = sun?.altitude ?? 90;
    this.svg.style.setProperty("--ef-darkness", 1 - smoothstep(-13, 10, altitude));
    // Christmas lights are either on or off: on once the sun is a few degrees down, like a timer switch.
    this.svg.classList.toggle("ef-xmas-lit", altitude < -3);
    this.svg.style.setProperty("--ef-starlight", 1 - smoothstep(-14, -5, altitude));
    const twilight = smoothstep(-13, -3, altitude) * (1 - smoothstep(-2, 8, altitude));
    this.svg.style.setProperty("--ef-twilight", twilight * visibility);
    if (sun && twilight) this.attr(this.part("ef-twilight"), "cx", skyX(sun.progress));

    const sunlight = sun ? visibility * smoothstep(HORIZON, 4, altitude) : 0;
    const sunHeight = Math.sin(Math.max(0, altitude) * Math.PI / 180);
    this.light("sun", sun, sunlight);

    const fraction = moon?.illuminated ?? 0;
    const moonlightKey = () => moon ? `${Math.round(skyX(moon.progress) / 8)},${Math.round(moon.altitude / 2)}` : "";
    const moonlight = moon ? visibility * (1 - smoothstep(-6, HORIZON, altitude)) * smoothstep(HORIZON, 2, moon.altitude) : 0;
    const moonBrightness = moonlight * Math.min(1, fraction * 45);
    this.light("moon", moon, moonBrightness);
    // Both arrays reference the same glints. Repainting their gradients at every slider step is costly.
    const reflect = () => {
      this.panelReflection("sun", sun, sunlight * (.45 + .35 * sunHeight));
      this.panelReflection("moon", moon, moonlight * fraction ** 1.5 * .2);
    };
    clearTimeout(this.reflectionTimer);
    if (this.level === "low" && this.skyKey !== undefined) this.reflectionTimer = setTimeout(reflect, 400);
    else reflect();
    // The shimmer's snapshot is taken again once the sky looks different: the sun or moon a few units on, or the
    // light a step brighter or darker. Coarse enough that a live card, whose sky creeps, takes a new one about
    // every five minutes at the most; a jump in time (the lab's slider) takes one at once.
    const step = (v) => Math.round(v * 20);
    this.skyKey = [step(1 - smoothstep(-13, 10, altitude)), step(twilight * visibility), step(sunlight),
      sun && sunlight ? `${Math.round(skyX(sun.progress) / 8)},${Math.round(altitude / 2)}` : "",
      step(moonBrightness), moonBrightness ? moonlightKey() : ""].join(",");
    if (!moonBrightness) return;

    // The limb is a semicircle, and the terminator is an ellipse whose width follows the illuminated fraction.
    const r = MOON_RADIUS, terminator = r * Math.abs(1 - 2 * fraction);
    const phase = this.part("ef-moon-phase");
    this.attr(phase, "d", `M0 ${-r}A${r} ${r} 0 0 1 0 ${r}A${terminator} ${r} 0 0 ${+(fraction > .5)} 0 ${-r}Z`);
    this.attr(phase, "transform", `rotate(${moon.tilt})`);
    this.attr(this.part("ef-moon-halo"), "opacity", .3 * fraction ** .65);
    const title = this.part("ef-moon-title");
    const label = `Moon, ${Math.round(fraction * 100)}% illuminated`;
    if (title.textContent !== label) title.textContent = label;
  }

  // Readings in watts: solar, home, grid (+ import, − export), battery1/battery2 { power (+ gives out, − charges), soc }.
  // weather is one of WEATHERS; sky is energySky()'s result, or null for a plain daytime sky; time (ms) is the moment
  // shown, for the seasonal decorations; temperature (°C) brings heat shimmer or frost.
  update(state) {
    const cfg = this.cfg, color = this.colors;
    const b1 = cfg.battery1.show ? state.battery1 || {} : {}, b2 = cfg.battery2.show ? state.battery2 || {} : {};
    const solar = cfg.solar.show ? Math.max(0, flow(state.solar)) : 0;
    const b1w = flow(b1.power), b2w = flow(b2.power), grid = flow(state.grid);
    let home = state.home;
    // Home worked out from the others only when every part in the picture has a reading: with one sensor unavailable
    // the sum would be wrong, so home shows a dash too. The car is apart from home: what it takes (+) or gives (−)
    // is set aside first, when there is a reading for it.
    // A car with a sensor set up counts even when its reading is unavailable (then home is unknown too).
    const carIn = cfg.ev?.entity || !missing(state.ev) ? (missing(state.ev) ? null : -state.ev) : false;
    const inputs = [state.grid, cfg.solar.show && state.solar, cfg.battery1.show && b1.power, cfg.battery2.show && b2.power,
      carIn].filter((v) => v !== false);
    if (missing(home) && inputs.every((v) => !missing(v))) {
      home = Math.max(0, inputs.reduce((sum, v) => sum + v, 0));
    }
    this.text("ef-solar", kw(missing(state.solar) ? null : Math.max(0, state.solar)), !solar);
    this.text("ef-home", kw(home), !flow(home));
    this.text("ef-grid", kw(state.grid), !grid);
    // The garage is on or off in the config: on, its shutter is up and the car shows, charging or not. The EV label
    // shows whenever there is a power or charge reading for the car (0 kW still shows its charge), the garage shut
    // too: then it points at the door.
    const ev = missing(state.ev) ? 0 : flow(state.ev);
    const open = state.garage ?? cfg.garage === "open";
    this.svg.classList.toggle("ef-lights-off", state.lights === false);
    if (open !== this.svg.classList.contains("ef-garage-open") && !this.svg.classList.contains("ef-still")) {
      this.svg.classList.add("ef-garage-moving");  // drawn live while it moves (see .ef-baked)
      clearTimeout(this.garageMoving);
      this.garageMoving = setTimeout(() => {
        this.svg.classList.remove("ef-garage-moving");
        // the cable's pulses were held back while the shutter moved: the pulse layer looks again
        for (const piece of this.pulses?.pieces || []) piece.key = null;
        this.pulses?.update();
        this.alignBeats();  // the svg's own pulses, where they draw them, start in step
        this.restAgain();
      }, GARAGE_MOVES);
    }
    this.svg.classList.toggle("ef-garage-open", open);
    this.svg.classList.toggle("ef-ev-on", !(missing(state.ev) && missing(state.evSoc)));
    this.text("ef-ev", kw(state.ev), !ev);
    const evDir = this.part("ef-ev-dir"), evArrow = ev < 0 ? "▼" : "▲";  // as on the batteries: ▲ charges, ▼ gives out
    if (evDir.textContent !== evArrow) evDir.textContent = evArrow;
    this.attr(evDir, "fill-opacity", ev ? 1 : 0);  // kept in the line, so the charge doesn't jump sideways
    this.text("ef-ev-soc", missing(state.evSoc) ? "" : `${Math.round(state.evSoc)}%`, null);
    this.battery("b1", b1.power, b1.soc);
    this.battery("b2", b2.power, b2.soc);
    this.extras(state.extras || []);

    // Who feeds what: the street takes solar first, then the batteries; a charging battery takes solar first, then
    // the grid, then the other battery; the house gets what is left. A charging battery or the street takes the
    // colour of what feeds it most.
    // The car is a source too while it gives power out (vehicle-to-home or -grid).
    const evOn = !missing(state.ev) && ev !== 0;
    const left = { solar, b1: Math.max(0, b1w), b2: Math.max(0, b2w), grid: Math.max(0, grid), ev: evOn ? Math.max(0, -ev) : 0 };
    // Takes what `need` asks for from the sources in order: the colour of the one that gave most (`own`, the taker's
    // colour, when none could: readings that do not add up), and every source that gave at least FLOW_MIN, in order.
    const feed = (need, order, own) => {
      let most = null, best = 0;
      const from = [];
      for (const k of order) {
        const got = Math.min(need, left[k]);
        if (got <= 0) continue;
        left[k] -= got;
        need -= got;
        if (got > best) [most, best] = [k, got];
        if (got >= FLOW_MIN) from.push(k);
      }
      return { color: most ? color[most] : own, from };
    };
    // The house is supplied first, as a home's own loads are: solar, then the batteries, the car, the grid. Batteries
    // charging and the street then share what is left, so a picture whose readings do not quite add up still shows
    // what feeds the house. With no home reading the house gets whatever is left over at the end, as before.
    const house = { solar: 0, b1: 0, b2: 0, ev: 0, grid: 0 };
    if (!missing(home)) {
      let need = Math.max(0, home);
      for (const k of ["solar", "b1", "b2", "ev", "grid"]) {
        const got = Math.min(need, left[k]);
        left[k] -= got;
        need -= got;
        house[k] = got;
      }
    }
    const before = { ...left };
    const toGrid = feed(Math.max(0, -grid), ["solar", "b2", "b1", "ev"], color.grid).color;
    // Every source that sends at least FLOW_MIN out to the street gets its own grid lane (the biggest always does),
    // up to the four the grid pipe can carry.
    const exporters = grid < 0 ? ["solar", "b1", "b2", "ev"].filter((k) => before[k] - left[k] >= FLOW_MIN) : [];
    const toB1 = feed(Math.max(0, -b1w), ["solar", "ev", "grid", "b2"], color.b1);
    const toB2 = feed(Math.max(0, -b2w), ["solar", "ev", "grid", "b1"], color.b2);
    // The car, apart from the house: charging, it takes solar first, then the batteries, then the grid; giving power
    // out, its pulses are its own colour.
    const toEv = evOn && ev > 0 ? feed(ev, ["solar", "b1", "b2", "grid"], color.ev) : null;
    // Charging from several sources, their pulses take turns on the line, as on the grid pipe; giving power out, its
    // own colour.
    const mix = (fed) => (fed.from.length > 1 ? fed.from.map((k) => color[k]) : [fed.color]);
    // The car is like a battery: "in" charges it. Its cable shows only with the shutter up (hidden while it moves);
    // what it gives out still shows where it goes (the house, the street, a battery), the shutter down or not.
    this.turnLanes(EV_FLOWS, evOn && open && (ev > 0 ? "in" : "out"), toEv ? mix(toEv) : [false]);
    this.pulse("solar", solar && "out");
    const bWay = (w) => (w > 0 ? "out" : w < 0 && "in");
    this.line("b1", bWay(b1w), 0, null, true, false);
    this.line("b2", bWay(b2w), 0, null, true, false);
    this.turnLanes(B1_FLOWS, bWay(b1w), b1w < 0 ? mix(toB1) : [false]);
    this.turnLanes(B2_FLOWS, bWay(b2w), b2w < 0 ? mix(toB2) : [false]);
    if (grid < 0) this.gridLanes(exporters.length ? exporters.map((k) => ["out", color[k]]) : [["out", toGrid]]);
    else this.gridLanes([[grid > 0 && "in"]]);  // the grid's "in" is into the house
    // From the meter box on to the house, top to bottom: solar, battery 1, battery 2, grid, the car - one lane for
    // each that feeds it, in places -1 (above battery 1's pipe) to 2 (the lowest the box's face covers). The
    // batteries' lanes run straight through the box (battery 1 place 0, battery 2 place 1), the others stack on
    // them. With nothing feeding the house its line still shows: the grid's lane, idle.
    const used = missing(home) || home >= FLOW_MIN;
    const feeds = (k) => used && (missing(home) ? left[k] : house[k]) >= FLOW_MIN;
    const fed = Object.fromEntries(["solar", "b1", "b2", "grid", "ev"].map((k) => [k, feeds(k)]));
    const count = Object.values(fed).filter(Boolean).length;
    const { places, share } = housePlaces(fed, !b1w && !!b2w);
    // Idle and one source feeding the house swap with no fade or slide, either way.
    const swap = (this.houseCount === 0 && count === 1) || (this.houseCount === 1 && count === 0);
    this.svg.classList.toggle("ef-swap", swap && !this.svg.classList.contains("ef-still"));
    this.houseCount = count;
    // Sharing: the batteries take turns on battery 1's line, battery 2's own rail hidden. Battery 2's line keeps that
    // while it fades out, so its rail does not flash up over battery 1's.
    if (share !== this.sharedHouse) {
      this.sharedHouse = share;
      this.turnStyle("h1", share ? 2 : 1, 0);
      this.restartBeats();
    }
    if (fed.b2) {
      this.turnStyle("h3", share ? 2 : 1, 1);
      this.part("ef-l-h3").classList.toggle("ef-shared", share);
    }
    this.line("h1", fed.b1 && "out", places.b1, color.b1);
    this.line("h2", fed.solar && "out", places.solar, color.solar);
    this.line("h3", fed.b2 && "out", places.b2, color.b2);
    this.line("h4", fed.grid && "out", places.grid, color.grid, count === 0);
    this.line("h5", fed.ev && "out", places.ev, color.ev);
    this.updatePulseCadence();
    this.flushBeats();
    this.alignBeats();

    // Festive decorations from 6 December to 6 January, unless switched off in the config (festive) or by a tap.
    this.svg.classList.toggle("ef-christmas", cfg.festive !== false && christmasSeason(state.time));
    this.svg.classList.toggle("ef-xmas-off", state.decorations === false);  // fades away (see the svg)

    const weather = WEATHERS.includes(state.weather) ? state.weather : "cloudy";
    this.attr(this.svg, "data-weather", PICTURE_WEATHER[weather]);
    if (state.sky !== this.lastSky || weather !== this.lastSkyWeather) {
      this.updateSky(state.sky, weather);
      this.lastSky = state.sky;
      this.lastSkyWeather = weather;
    }
    this.temperature(state.temperature);
    // The pulses on the GPU where the browser can; otherwise the svg's own stay.
    // Made once the picture is on the page: Home Assistant sends the first readings before that, when the dashes have
    // no computed lengths, opacities or colours yet and the pulses would be measured as nothing (issue #1).
    if (this.svg.isConnected) this.updatePulses();
    // A new look (weather, heat) is judged afresh.
    const look = lookKey(this.svg);
    if (look !== this.watchedLook) { this.watchedLook = look; this.fine = 0; this.watchFrames(); }

    this.alignLabels();  // the readings changed the labels' widths
    if (this.svg.classList.contains("ef-swap")) {
      this.svg.getBoundingClientRect();  // the house lines swapped with transitions off
      this.svg.classList.remove("ef-swap");
    }
    if (this.svg.classList.contains("ef-still")) {
      this.svg.getBoundingClientRect();  // lays the lanes out where they are before transitions are switched on
      this.svg.classList.remove("ef-still");
    }
    this.restAgain();
  }

  updatePulses() {
    if (!this.pulses && typeof WebGLRenderingContext === "function") {
      this.svg.classList.remove("ef-no-gl");
      this.syncFallbackDashes();
      this.pulses = new PulseRenderer(this);
    }
    this.svg.classList.toggle("ef-no-gl", !this.pulses || !!this.pulses.failed);
    this.syncFallbackDashes();
    this.pulses?.update();
  }

  // Animations started while the picture rests (by readings, or by a timer below once a slide is over) pause too.
  restAgain() {
    if (!this.pulsesRun()) this.syncAnimations(true);
  }

  // Home's other loads (pool, A/C...), listed above its label: [{ name, power (W), entity }]. A load drawing less than
  // FLOW_MIN folds away and unfolds again when it starts (an unavailable one stays, with a dash). More than EXTRA_ROWS
  // scroll; scrolling past either end goes on to the page. The edge with more rows beyond it fades out.
  extras(list) {
    const box = this.part("ef-extras"), rows = box.firstElementChild;
    const key = JSON.stringify(list.map((e) => [e.name, e.entity || ""]));
    const fresh = key !== this.extrasKey;
    if (fresh) {
      this.extrasKey = key;
      rows.replaceChildren(...list.map((e) => {
        const row = document.createElement("div"), name = document.createElement("span"), value = document.createElement("span");
        row.className = "ef-extra";
        if (e.entity) row.dataset.entity = e.entity;
        name.className = "ef-extra-name";
        name.textContent = String(e.name ?? "").toUpperCase();
        name.title = String(e.name ?? "");
        value.className = "ef-extra-val";
        row.append(name, value);
        return row;
      }));
      const height = Math.min(list.length, EXTRA_ROWS) * EXTRA_ROW;
      this.attr(box, "y", EXTRA_BOTTOM - height);
      this.attr(box, "height", height);
      if (list.length) box.removeAttribute("display");
      else box.setAttribute("display", "none");
      if (!this.extrasScroll) {
        this.extrasScroll = () => this.fadeExtras();
        rows.addEventListener("scroll", this.extrasScroll, { passive: true });
        rows.addEventListener("transitionend", this.extrasScroll);
        this.scrollExtrasBy(rows);
      }
    }
    list.forEach((e, i) => {
      const value = rows.children[i].lastElementChild, text = kw(e.power);
      if (value.textContent !== text) value.textContent = text;
      rows.children[i].classList.toggle("ef-extra-off", !missing(e.power) && !flow(e.power));
    });
    // New rows start folded or not, with no animation: nothing above reads the layout before this.
    if (fresh) rows.scrollTop = 0;
    this.fadeExtras();
  }

  // The list is overflow:hidden (Safari draws nothing of a natively scrolling foreignObject), so wheel and touch move
  // it here. At an end the gesture goes on to the page; a touch settles on a whole row.
  scrollExtrasBy(rows) {
    const room = (dy) => dy < 0 ? rows.scrollTop > 0 : rows.scrollTop < rows.scrollHeight - rows.clientHeight - 1;
    const units = () => rows.clientHeight / (rows.getBoundingClientRect().height || rows.clientHeight || 1);
    rows.addEventListener("wheel", (e) => {
      const dy = e.deltaY * (e.deltaMode === 1 ? EXTRA_ROW : 1);
      if (!dy || !room(dy)) return;
      e.preventDefault();
      rows.scrollTop += dy * units();
    }, { passive: false });
    let lastY = null;
    rows.addEventListener("touchstart", (e) => { lastY = e.touches[0].clientY; }, { passive: true });
    rows.addEventListener("touchmove", (e) => {
      if (lastY === null) return;
      const y = e.touches[0].clientY, dy = lastY - y;
      if (!room(dy)) { lastY = null; return; }  // the rest of this touch scrolls the page
      e.preventDefault();
      lastY = y;
      rows.scrollTop += dy * units();
    }, { passive: false });
    rows.addEventListener("touchend", () => {
      lastY = null;
      rows.scrollTo?.({ top: Math.round(rows.scrollTop / EXTRA_ROW) * EXTRA_ROW, behavior: "smooth" });
    }, { passive: true });
  }

  fadeExtras() {
    const rows = this.part("ef-extras").firstElementChild;
    // The row cut by an edge with more beyond it fades (a mask did this, which Safari cannot draw in a foreignObject).
    // Measured on screen from the rows that are there: Safari loses a positioned list in a foreignObject (no offsetTop
    // to count from), and the folded rows' slide adds scroll room below that holds nothing.
    const box = rows.getBoundingClientRect();
    const shown = [...rows.children].map((row) => ({ row, r: row.getBoundingClientRect() })).filter((x) => x.r.height > 1);
    const above = shown.length > 0 && shown[0].r.top < box.top - 1;
    const below = shown.length > 0 && shown[shown.length - 1].r.bottom > box.bottom + 1;
    for (const row of rows.children) row.classList.remove("ef-extra-edge");
    for (const { row, r } of shown) {
      if ((above && r.top < box.top - 1) || (below && r.bottom > box.bottom + 1)) row.classList.add("ef-extra-edge");
    }
  }

  // Air temperature in °C, or nothing. The shimmer grows a little stronger with the heat.
  temperature(celsius) {
    this.celsius = celsius;
    const hot = !missing(celsius) && celsius > HOT && LEVELS[this.level].shimmer && !matchMedia(REDUCED_MOTION).matches;
    this.svg.classList.toggle("ef-hot", hot);
    const frost = missing(celsius) ? 0 : Math.max(0, Math.min(1, (FROST_START - celsius) / (FROST_START - FROST_FULL)));
    this.svg.classList.toggle("ef-frosty", frost > 0);
    this.svg.style.setProperty("--ef-frost", frost.toFixed(2));
    if (hot) {
      this.shimmer ??= new HeatShimmer(this.svg, this);
      this.shimmer.show(Math.min(8, 3 + (celsius - HOT) * .4));
    } else {
      this.shimmer?.hide();
    }
  }

  restWhenUnseen() {
    const wasPaused = this.paused;
    this.paused = !this.seen || document.hidden || !!this.suspended;
    this.syncAnimations();
    this.shimmer?.sync();
    this.pulses?.sync();
    this.watchFrames();
    this.alignBeats();
    if (wasPaused && !this.paused) this.onVisible?.();
  }

  // What the shimmer snapshot shows: the look of the still parts and the sky. What stays live over the snapshot
  // (garage, shutter, lights, lanes) is left out, so a tap on the shutter or the window takes no new one.
  shimmerLook() {
    return [...this.svg.classList].filter((c) => !TRANSIENT.has(c) && !LIVE_OVER_SHIMMER.has(c)).join(" ")
      + "|" + this.svg.getAttribute("data-weather") + "|" + this.svg.getAttribute("data-time");
  }
}

// The Home Assistant card: <energy-flow-card>, a Lovelace custom card. It reads power sensors, a weather entity
// and Home Assistant's location, and draws them with EnergyFlowView. The lab page drives the same element
// through preview(), without Home Assistant.

// Home Assistant's weather states -> the picture's weather
const HA_WEATHER = {
  "clear-night": "clear", sunny: "clear", partlycloudy: "partly", cloudy: "cloudy", fog: "fog", hail: "snow",
  lightning: "storm", "lightning-rainy": "storm", pouring: "heavy", rainy: "rain", snowy: "snow",
  "snowy-rainy": "rain", windy: "partly", "windy-variant": "cloudy", exceptional: "cloudy",
};
const PARTS = ["solar", "home", "grid", "battery1", "battery2", "ev"];
const isEntity = (v) => typeof v === "string" && /^[a-z_]+\.[\w-]+$/i.test(v.trim());
// Entity states that count as open (the garage) or on (the lights). A cover still opening is drawn shut: its shutter
// rolls up, and the car's pulses start, once it is all the way open; closing, it comes down at once.
const OPEN = ["open", "on"], ON = ["on", "open"];

// The config as written (YAML or the editor) -> every option filled in. A part given as a plain string is its entity.
// festive: an easter egg, not in the editor or the README. Decorations from 6 December to 6 January, on unless
// festive (or christmas, its name before 0.8) is false.
function normalizeConfig(config = {}) {
  const out = { title: config.title || "", weather: config.weather || "", temperature: config.temperature || "", latitude: config.latitude, longitude: config.longitude,
    festive: (config.festive ?? config.christmas) !== false, effects: effectsLevel(config.effects),
    // auto, high, medium or low — or an entity (input_select / select) whose state chooses the detail level.
    effectsEntity: isEntity(config.effects) ? config.effects.trim() : "",
    // light or dark, or auto: Home Assistant's own dark mode (outside it, the device's). Or an entity (an input_select,
    // select or input_boolean) whose state says which: light, dark or auto (on = dark).
    theme: ["light", "dark"].includes(config.theme) ? config.theme : "auto",
    themeEntity: isEntity(config.theme) ? config.theme.trim() : "",
    // For trying the picture: an entity holding a date and time (input_datetime, or a timestamp sensor) that the sky and
    // the clock follow instead of now.
    timeEntity: isEntity(config.time) ? config.time.trim() : "",
    // The garage and the house lights: on or off, or an entity (a cover, switch or light) that says which and that a
    // tap on the shutter or the window toggles. Without one a tap toggles the picture alone.
    garage: [true, 1, "1", "open", "on"].includes(config.garage) ? "open" : "closed",
    garageEntity: isEntity(config.garage) ? config.garage.trim() : "",
    lights: [false, 0, "0", "off", "closed"].includes(config.lights) ? "off" : "on",
    lightsEntity: isEntity(config.lights) ? config.lights.trim() : "" };
  for (const key of PARTS) {
    let c = config[key];
    if (typeof c === "string") c = { entity: c };
    if (c === false) c = { show: false };
    c = { ...(c || {}) };
    if (key.startsWith("battery") && c.glass && !c.face) c.face = c.glass;  // the battery's glass front
    delete c.glass;
    const part = { ...DEFAULTS[key], ...c };
    for (const k of ["color", "face"]) if (part[k] && !validColor(part[k])) part[k] = DEFAULTS[key][k];
    if ("show" in DEFAULTS[key]) {
      // The batteries are on unless switched off; solar shows once it has a sensor.
      const hasEntity = !!(c.entity || c.power || c.soc || c.charge || c.discharge);
      part.show = c.show ?? (config.preview || key.startsWith("battery") ? true : hasEntity);
    }
    out[key] = part;
  }
  // Home's other loads, listed above its label: each a sensor (a plain entity id is fine), with an optional name.
  if (!out.battery1.show) out.battery2.show = false;  // battery 2 only alongside battery 1
  out.home.extras = (Array.isArray(out.home.extras) ? out.home.extras : [])
    .map((e) => (typeof e === "string" ? { entity: e } : { ...(e || {}) }))
    .filter((e) => e.entity || e.name);
  out.look = { ...DEFAULTS.look, ...(config.look || {}) };
  for (const k of Object.keys(out.look)) if (!validColor(out.look[k])) out.look[k] = DEFAULTS.look[k];
  return out;
}

const UNIT = { w: 1, kw: 1000, mw: 1e6 };
const RELEASE_AFTER = 10000;  // ms off the page before a card counts as thrown away

class EnergyFlowCard extends HTMLElement {
  // Standalone dashboards can feed the same renderer directly and retain their own layout and interactions.
  static createView(container) {
    return new EnergyFlowView(container, SVG, PULSE_PROFILE, PULSE_WORKER);
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; }
        ha-card, .card { overflow: hidden; contain: layout style; background: var(--efc-background, #17181a); border-radius: var(--ha-card-border-radius, 12px); }
        .card { display: block; }
        .picture { contain: layout style paint; }
        .title { margin: 0; padding: 14px 16px 0; font: 500 16px/1.3 var(--paper-font-body1_-_font-family, system-ui, sans-serif); color: #f1f1f1; }
        .light .title { color: #1d1e20; }
        /* Not an icon: back to SVG's own defaults, whatever the page around it inherits. */
        .picture svg { display: block; width: 100%; height: auto; fill: #000; stroke: none; stroke-width: 1; stroke-linecap: butt; stroke-linejoin: miter; letter-spacing: normal; }
      </style>
      <div class="card" part="card"><h2 class="title" hidden></h2><div class="picture"></div></div>`;
    this.picture = this.shadowRoot.querySelector(".picture");
    this.titleEl = this.shadowRoot.querySelector(".title");
    this.view = EnergyFlowCard.createView(this.picture);
    this.view.onVisible = () => { if (this.readingsPending) this.queueReadings(); };
    this.view.part("ef-labels").addEventListener("click", (e) => this.openMoreInfo(e));
    this.view.part("ef-tap-garage").addEventListener("click", () => this.toggle("garage"));
    this.view.part("ef-tap-window").addEventListener("click", () => this.tapWindow());
    this.local = {};
    this.config = normalizeConfig({});
    // auto outside Home Assistant (the lab): the device's light or dark setting
    this.scheme = window.matchMedia?.("(prefers-color-scheme: light)");
    // Listened to only while on the page: a query with a listener is never collected, and would keep every card
    // ever made (the editor makes them anew), picture and all (issue #3).
    this.onScheme = () => { if (this.applyTheme()) this.render(); };
  }

  // Home Assistant wraps cards in <ha-card> for the theme's shadow and radius; outside it we keep our own box.
  connectedCallback() {
    const card = this.shadowRoot.querySelector(".card");
    if (customElements.get("ha-card") && card.tagName !== "HA-CARD") {
      const haCard = document.createElement("ha-card");
      haCard.className = card.className;  // "card", and "light" in light mode
      haCard.append(...card.childNodes);
      card.replaceWith(haCard);
    }
    clearTimeout(this.leaving);
    this.scheme?.addEventListener?.("change", this.onScheme);
    this.applyTheme();  // the device's setting may have changed while the card was off the page
    if (this._hass) this.startClock();
    if (this.view.suspended) this.view.resume();
    // The readings that came in before it was on the page. Inside a fresh <ha-card> the picture is not drawn (no slot
    // yet, so no computed styles) until ha-card has rendered: measured before that, every pulse came out as nothing
    // and the lines never moved (issue #1 again in 0.8.0).
    const haCard = this.shadowRoot.querySelector("ha-card");
    if (haCard?.updateComplete && !haCard.hasUpdated) haCard.updateComplete.then(() => { if (this.isConnected) this.render(); });
    else this.render();
  }

  disconnectedCallback() {
    cancelAnimationFrame(this.readingsFrame);
    this.readingsFrame = 0;
    clearInterval(this.clock);
    this.clock = null;
    this.scheme?.removeEventListener?.("change", this.onScheme);
    this.view.suspend();
    // Moved on the dashboard or back on a view switch, it carries on as it was. Still off the page after a while, it
    // was thrown away (the editor makes cards anew): its GPU memory goes at once, which older devices need.
    clearTimeout(this.leaving);
    this.leaving = setTimeout(() => { if (!this.isConnected) this.view.release(); }, RELEASE_AFTER);
  }

  setConfig(config) {
    if (!config || typeof config !== "object") throw new Error("Invalid configuration");
    this.rawConfig = config;
    this.watchedFor = null;  // the same object may come back changed: its entities are read again
    this.config = normalizeConfig(config);
    this.local = {};  // taps without an entity last until the config changes
    this.titleEl.textContent = this.config.title;
    this.titleEl.hidden = !this.config.title;
    this.light = null;
    this.effectsMode = null;
    this.applyEffects();
    this.applyTheme();
    for (const [id, part] of [["ef-solar-label", "solar"], ["ef-home-name", "home"], ["ef-home", "home"],
      ["ef-grid-name", "grid"], ["ef-grid", "grid"], ["ef-ev-label", "ev"], ["ef-b1-label", "battery1"], ["ef-b2-label", "battery2"]]) {
      this.view.part(id).classList.toggle("ef-clickable", !!this.entityOf(part));
    }
    this.render();
  }

  // Home Assistant sets hass on every state change in the house, many a second in a big one. The picture is drawn
  // again only when one of the card's own entities (or HA's location and units) changed: drawing on each of them
  // kept older devices busy and the whole dashboard sluggish (issue #3).
  set hass(hass) {
    const old = this._hass;
    this._hass = hass;
    if (!this.clock && this.isConnected) this.startClock();
    const themeChanged = this.applyTheme(), effectsChanged = this.applyEffects();
    if (!themeChanged && !effectsChanged && old && old.config === hass.config && this.watched().every((e) => old.states[e] === hass.states[e])) return;
    this.queueReadings();
  }

  // HA may deliver several readings before the screen paints. Keep the latest state while offscreen, too.
  queueReadings() {
    this.readingsPending = true;
    if (this.readingsFrame || !this.isConnected || this.view.paused || document.hidden) return;
    this.readingsFrame = requestAnimationFrame(() => {
      this.readingsFrame = 0;
      if (this.readingsPending && !this.view.paused && !document.hidden) this.render();
    });
  }

  // Every entity in the config, as written: the parts' sensors, extras, weather, temperature, garage and lights.
  watched() {
    if (this.watchedFor === this.rawConfig) return this.watchedList;
    const found = new Set();
    const walk = (v) => {
      if (isEntity(v)) found.add(v.trim());
      else if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object") Object.values(v).forEach(walk);
    };
    walk(this.rawConfig);
    this.watchedFor = this.rawConfig;
    return (this.watchedList = [...found]);
  }

  get hass() { return this._hass; }

  // Light or dark, from the config or (auto) Home Assistant's dark mode. The picture is configured again only when it
  // changes; true when it did.
  applyTheme() {
    let theme = this.config.theme;
    const chosen = this.config.themeEntity && this._hass?.states[this.config.themeEntity]?.state;
    if (chosen) theme = chosen === "on" ? "dark" : chosen === "off" ? "light" : ["light", "dark"].includes(String(chosen).toLowerCase()) ? String(chosen).toLowerCase() : "auto";
    const dark = this._hass?.themes?.darkMode;
    const light = theme === "auto" ? (typeof dark === "boolean" ? !dark : !!this.scheme?.matches) : theme === "light";
    if (light === this.light) return false;
    this.light = light;
    const cfg = { ...this.config, light, effects: this.effectsMode ?? this.config.effects }, background = themed(cfg, "look", "background");
    this.picture.style.background = background;
    this.shadowRoot.host.style.setProperty("--efc-background", background);
    this.shadowRoot.querySelector(".card").classList.toggle("light", light);
    this.view.configure(cfg);
    return true;
  }

  // Detail level, from the config or an entity (input_select / select). Applied only when it changes; true when it did.
  applyEffects() {
    const chosen = this.config.effectsEntity && this._hass?.states[this.config.effectsEntity]?.state;
    const effects = chosen ? effectsLevel(String(chosen).toLowerCase()) : this.config.effects;
    if (effects === this.effectsMode) return false;
    this.effectsMode = effects;
    if (this.view.cfg) {
      this.view.cfg = { ...this.view.cfg, effects };
      this.view.applyEffects();
    }
    return true;
  }

  // Now, or the moment the `time` entity holds (its own states are local time, as input_datetime's are).
  now() {
    const s = this.config.timeEntity && this._hass?.states[this.config.timeEntity]?.state;
    const t = s ? new Date(/^\d{4}-\d\d-\d\d \d/.test(s) ? s.replace(" ", "T") : s).getTime() : NaN;
    return Number.isFinite(t) ? t : Date.now();
  }

  // The sky moves on even when no sensor changes.
  startClock() {
    clearInterval(this.clock);
    this.clock = setInterval(() => this.queueReadings(), 60000);
  }

  // Garage open, lights on: the entity's state if there is one, else a tap's, else the config's.
  switchedOn(part) {
    const entity = this.config[`${part}Entity`], s = entity && this._hass?.states[entity]?.state;
    if (entity && s !== undefined && !this.previewState) return (part === "garage" ? OPEN : ON).includes(s);
    return this.local[part] ?? (part === "garage" ? this.config.garage === "open" : this.config.lights === "on");
  }

  // A tap on the shutter or the window: the entity toggles in Home Assistant, or the picture alone. The lab hears it
  // as an energy-flow-toggle event.
  toggle(part) {
    const entity = this.config[`${part}Entity`], on = !this.switchedOn(part);
    if (entity && this._hass && !this.previewState) {
      const cover = entity.startsWith("cover.");
      this._hass.callService(cover ? "cover" : "homeassistant", "toggle", { entity_id: entity });
      return;
    }
    this.local[part] = on;
    this.render();
    this.dispatchEvent(new CustomEvent("energy-flow-toggle", { detail: { part, on }, bubbles: true, composed: true }));
  }

  // In the festive season a tap on the window steps through three: all on, the decorations off with the room still lit,
  // everything off. The decorations show only with the lights on, and then light up after sunset by themselves.
  tapWindow() {
    const time = this.previewState?.time ?? this.now();
    if (!this.config.festive || !christmasSeason(time)) { this.toggle("lights"); return; }
    const lights = this.switchedOn("lights"), decorations = this.local.decorations ?? true;
    const next = lights && decorations ? [true, false] : lights ? [false, false] : [true, true];
    this.local.decorations = next[1];
    if (next[0] !== lights) this.toggle("lights");
    else this.render();
  }

  // The lab's way in: readings, weather and sky set by hand instead of read from Home Assistant.
  preview(state) {
    this.previewState = state;
    this.render();
  }

  entityOf(part) {
    const c = this.config[part];
    return c.entity || c.power || c.soc || c.import || c.discharge || "";
  }

  openMoreInfo(event) {
    const extra = event.target.closest?.("[data-entity]")?.dataset.entity;
    if (extra && this._hass) {
      this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: extra }, bubbles: true, composed: true }));
      return;
    }
    const target = event.target.closest("[id]");
    const map = { "ef-solar": "solar", "ef-solar-name": "solar", "ef-home": "home", "ef-home-name": "home",
      "ef-grid": "grid", "ef-grid-name": "grid", "ef-ev": "ev", "ef-ev-name": "ev" };
    let part = map[target?.id];
    if (!part) part = event.target.closest("#ef-b1-label") ? "battery1" : event.target.closest("#ef-b2-label") ? "battery2" : "";
    const entityId = part && this.entityOf(part);
    if (!entityId || !this._hass) return;
    this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId }, bubbles: true, composed: true }));
  }

  number(entityId) {
    const s = entityId && this._hass?.states[entityId];
    if (!s) return null;
    const v = parseFloat(s.state);
    return Number.isFinite(v) ? v : null;
  }

  watts(entityId) {
    const v = this.number(entityId);
    if (v === null) return null;
    const unit = String(this._hass.states[entityId].attributes?.unit_of_measurement || "W").toLowerCase();
    return v * (UNIT[unit] ?? 1);
  }

  // One signed reading from either a signed sensor or a pair of always-positive ones.
  signed(c, single, plus, minus) {
    let v;
    if (c[single]) v = this.watts(c[single]);
    else if (c[plus] || c[minus]) {
      const p = this.watts(c[plus]), m = this.watts(c[minus]);
      v = p === null && m === null ? null : (p || 0) - (m || 0);
    } else return null;
    return v !== null && c.invert ? -v : v;
  }

  skyAt(latitude, longitude, time) {
    if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
    // The wall clock advances the sky once per minute. An explicit time entity can also specify seconds.
    const instant = this.config.timeEntity ? time : Math.floor(time / 60000) * 60000;
    const cached = this.skyCache;
    if (cached?.instant === instant && cached.latitude === latitude && cached.longitude === longitude) return cached.sky;
    const sky = energySky(latitude, longitude, instant);
    this.skyCache = { instant, latitude, longitude, sky };
    return sky;
  }

  readHass() {
    const hass = this._hass, cfg = this.config;
    const weatherState = cfg.weather && hass.states[cfg.weather]?.state;
    const latitude = Number(cfg.latitude ?? hass.config?.latitude), longitude = Number(cfg.longitude ?? hass.config?.longitude);
    const time = this.now();
    const solar = this.signed(cfg.solar, "entity");
    return {
      solar: solar === null ? null : Math.abs(solar),
      home: this.signed(cfg.home, "entity"),
      extras: cfg.home.extras.map((e) => ({ name: e.name || hass.states[e.entity]?.attributes?.friendly_name || e.entity,
        power: this.signed(e, "entity"), entity: e.entity })),
      grid: this.signed(cfg.grid, "entity", "import", "export"),
      ev: this.signed(cfg.ev, "entity"),
      evSoc: this.number(cfg.ev.soc),
      battery1: { power: this.signed(cfg.battery1, "power", "discharge", "charge"), soc: this.number(cfg.battery1.soc) },
      battery2: { power: this.signed(cfg.battery2, "power", "discharge", "charge"), soc: this.number(cfg.battery2.soc) },
      weather: HA_WEATHER[weatherState] || (cfg.weather ? "cloudy" : "clear"),
      sky: this.skyAt(latitude, longitude, time),
      temperature: this.celsius(),
      time,
    };
  }

  // A temperature sensor if one is set, else the weather entity's own temperature; °F is converted.
  celsius() {
    const cfg = this.config, hass = this._hass;
    let value, unit;
    if (cfg.temperature) {
      value = this.number(cfg.temperature);
      unit = hass.states[cfg.temperature]?.attributes?.unit_of_measurement;
    } else {
      const attrs = cfg.weather && hass.states[cfg.weather]?.attributes;
      value = attrs ? parseFloat(attrs.temperature) : NaN;
      unit = attrs?.temperature_unit ?? hass.config?.unit_system?.temperature;
    }
    if (!Number.isFinite(value)) return null;
    return /F/i.test(unit || "") ? (value - 32) * 5 / 9 : value;
  }

  render() {
    if (this.view.suspended) return;  // off the page: drawn again when it is back (connectedCallback)
    this.readingsPending = false;
    const state = this.previewState || (this._hass ? this.readHass() : null);
    if (state) this.view.update({ ...state, garage: this.switchedOn("garage"), lights: this.switchedOn("lights"),
      decorations: this.switchedOn("lights") && (this.local.decorations ?? true) });
  }

  getCardSize() { return 7; }

  getGridOptions() { return { columns: 12, min_columns: 6, rows: "auto" }; }

  static getConfigForm() {
    const power = { entity: { domain: "sensor" } };
    const text = { text: {} };
    const color = (name) => ({ name, selector: text });
    return {
      schema: [
        { name: "title", selector: text },
        { name: "weather", selector: { entity: { domain: "weather" } } },
        { name: "temperature", selector: { entity: { domain: "sensor", device_class: "temperature" } } },
        { name: "garage", selector: { select: { mode: "dropdown", custom_value: true, options: [
          { value: "closed", label: "Off: shutter down" }, { value: "open", label: "On: the car and its wall charger" }] } } },
        { name: "lights", default: "on", selector: { select: { mode: "dropdown", custom_value: true, options: [
          { value: "on", label: "On" }, { value: "off", label: "Off" }] } } },
        { name: "effects", selector: { select: { mode: "dropdown", options: [
          { value: "auto", label: "Auto: asks on devices that struggle" }, { value: "high", label: "High" },
          { value: "medium", label: "Medium" }, { value: "low", label: "Low" }] } } },
        { name: "theme", selector: { select: { mode: "dropdown", options: [
          { value: "auto", label: "Auto: follows Home Assistant" }, { value: "dark", label: "Dark" }, { value: "light", label: "Light" }] } } },
        { type: "expandable", name: "solar", title: "Solar", schema: [
          { name: "entity", selector: power }, { name: "name", selector: text }, color("color"),
          { name: "show", selector: { boolean: {} } }] },
        { type: "expandable", name: "grid", title: "Grid", schema: [
          { name: "entity", selector: power }, { name: "import", selector: power }, { name: "export", selector: power },
          { name: "invert", selector: { boolean: {} } }, { name: "name", selector: text }, color("color")] },
        { type: "expandable", name: "home", title: "Home", schema: [
          { name: "entity", selector: power }, { name: "name", selector: text },
          { name: "extras", selector: { object: { multiple: true, label_field: "name", description_field: "entity", fields: {
            name: { label: "Name", selector: text }, entity: { label: "Power sensor", required: true, selector: power },
            invert: { label: "Flip the sign", selector: { boolean: {} } } } } } }] },
        { type: "expandable", name: "ev", title: "EV (the car behind the garage door)", schema: [
          { name: "entity", selector: power }, { name: "soc", selector: power }, { name: "invert", selector: { boolean: {} } },
          { name: "name", selector: text }, color("color")] },
        ...[1, 2].map((n) => ({ type: "expandable", name: `battery${n}`, title: `Battery ${n}`, schema: [
          { name: "show", selector: { boolean: {} } }, { name: "power", selector: power }, { name: "soc", selector: power },
          { name: "discharge", selector: power }, { name: "charge", selector: power },
          { name: "invert", selector: { boolean: {} } }, { name: "name", selector: text },
          color("color"), color("face")] })),
        { type: "expandable", name: "look", title: "House colours", schema: [
          color("glass"), color("roof"), color("wall"), color("window"), color("background")] },
      ],
      computeLabel: (s) => LABELS[s.name] ?? undefined,
      computeHelper: (s) => HELPERS[s.name] ?? undefined,
    };
  }

  static getStubConfig(hass) {
    const sensors = Object.keys(hass?.states || {}).filter((id) => id.startsWith("sensor.")
      && hass.states[id].attributes?.device_class === "power");
    const find = (...words) => sensors.find((id) => words.some((w) => id.includes(w))) || "";
    const socs = Object.keys(hass?.states || {}).filter((id) => id.startsWith("sensor.")
      && hass.states[id].attributes?.device_class === "battery");
    const weather = Object.keys(hass?.states || {}).find((id) => id.startsWith("weather.")) || "";
    // Only what was found goes in, so a new card's YAML has no empty entries. The batteries and the lights are on by
    // default; written out so the editor shows it.
    const config = { lights: "on", battery1: { show: true }, battery2: { show: true } };
    if (weather) config.weather = weather;
    for (const [part, key, id] of [["solar", "entity", find("solar", "pv")], ["grid", "entity", find("grid")],
      ["home", "entity", find("home", "house", "load", "consumption")], ["battery1", "power", find("battery")],
      ["battery1", "soc", socs[0]]]) {
      if (id) (config[part] ??= {})[key] = id;
    }
    return config;
  }
}

const LABELS = {
  title: "Title", weather: "Weather entity", temperature: "Outdoor temperature sensor (optional)", garage: "Garage (or a cover, switch or light entity; tap the shutter to toggle)", lights: "House lights (or a light or switch entity; tap the window to toggle)", effects: "Detail", theme: "Theme", entity: "Power sensor", import: "Import sensor (instead of one signed sensor)",
  export: "Export sensor", invert: "Flip the sign", name: "Name", color: "Flow colour (#rrggbb)", show: "Show in picture",
  power: "Power sensor", soc: "Charge (%) sensor", discharge: "Discharge sensor (instead of one signed sensor)",
  charge: "Charge sensor", face: "Glass cover colour (#rrggbb, any colour)", glass: "Solar glass", roof: "Roof", wall: "Wall",
  window: "Window", background: "Background", extras: "Other loads (listed above home)",
};
const HELPERS = {
  temperature: "Above 30 °C the air shimmers; below 3 °C frost grows, fully at -10 °C. Without a sensor the weather entity's temperature is used.",
  effects: "Auto asks on a device where the animation is choppy, and keeps the answer there.",
  extras: "Pool, A/C, dishwasher... each with its own power sensor. Shown above the home reading; more than three scroll.",
  invert: "Grid: + is import. Batteries: + is discharging. EV: + is charging the car. Turn on if your sensor uses the other sign.",
};

if (!customElements.get("energy-flow-card")) {
  // The pulses move by animating --ef-beat, which must be a registered number. The picture's own @property rule is
  // ignored inside a shadow root, so it is registered for the whole page here.
  try {
    CSS.registerProperty({ name: "--ef-beat", syntax: "<number>", inherits: true, initialValue: "0" });
  } catch { /* already registered (another copy of the card) or not supported */ }
  customElements.define("energy-flow-card", EnergyFlowCard);
  window.customCards = window.customCards || [];
  window.customCards.push({
    type: "energy-flow-card", name: "Energy Flow Card", preview: true,
    description: "An animated house showing solar, batteries, grid and home power under the real sky and weather.",
    documentationURL: "https://github.com/BieleckiLtd/energy-flow-card",
  });
  console.info(`%c ENERGY-FLOW-CARD %c ${VERSION} `, "background:#d6a62c;color:#000", "background:#17181a;color:#fff");
}

// The lab page uses the card's own sky maths.
window.EnergyFlowSky ??= energySky;

})();
