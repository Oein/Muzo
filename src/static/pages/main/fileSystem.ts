import session from "./session.js";
import { allowedPath } from "../../../types/allowedPath";
import * as ABPath from "./pathGoBack.js";

let drives = document.getElementById("sidebar") as HTMLDivElement;
let files = document.getElementById("files") as HTMLDivElement;

session;

let driveCounts = 0;
let driveSelected = 0;
let drives_paths: string[] = [];
let path = "/";

let files_path: { type: string; name: string }[] = [];
let file_selected = -1;
let file_c = 0;

let last_file_click = new Date().getTime() - 100000;

export function changePath(driveX: number, pathX: string) {
  drives.children[driveSelected + 1].className = "";
  driveSelected = driveX;
  drives.children[driveSelected + 1].className = "driveSelected";
  path = pathX;
  lsAndShow();
}

files.addEventListener("click", () => {
  if (file_selected != -1 && file_c == 0) {
    files.children[file_selected].className = "";
    file_selected = -1;
  }
  file_c = 0;
});

function createFileDiv(name: string, iconText: string = " folder ") {
  let containor = document.createElement("div");
  let icon = document.createElement("span");
  icon.className = "material-symbols-outlined icon";
  icon.innerText = iconText;
  let nameElement = document.createElement("div");
  nameElement.innerText = name;
  containor.append(icon);
  containor.append(nameElement);
  return containor;
}

export function lsAndShow() {
  files.innerHTML = "";
  axios
    .get(`/api/files/ls?drive=${drives_paths[driveSelected]}&path=${path}`, {
      headers: {
        Authorization: sessionStorage.getItem("SessionKey"),
      },
    })
    .then((v) => {
      files_path = v.data;
      v.data.forEach((d: { type: string; name: string }, i) => {
        let cfd: HTMLDivElement;
        if (d.type == "dir") {
          cfd = createFileDiv(d.name);
        } else if (d.type == "fil") {
          let dns = d.name.split(".");
          let iconName = " draft ";
          if (
            (!d.name.startsWith(".") && dns.length >= 2) ||
            (d.name.startsWith(".") && dns.length >= 3)
          ) {
            let ext = dns[dns.length - 1].toLocaleLowerCase();

            let codeLangs =
              `abap asc ash ampl mod g4 apib apl dyalog asp asax ascx ashx asmx aspx axd dats hats sats as adb ada ads agda als apacheconf vhost cls applescript scpt arc ino asciidoc adoc asc aj asm a51 inc nasm aug ahk ahkl au3 awk auk gawk mawk nawk bat cmd befunge bison bb bb decls bmx bsv boo b bf brs bro c cats h idc w cs cake cshtml csx cpp c++ cc cp cxx h h++ hh hpp hxx inc inl ipp tcc tpp c-objdump chs clp cmake cob cbl ccp cobol cpy css csv capnp mss ceylon chpl ch ck cirru clw icl dcl click clj boot cl2 cljc cljs cljscm cljx hic coffee _coffee cake cjsx cson iced cfm cfml cfc lisp asd cl l lsp ny podsl sexp cp cps cl coq v cppobjdump c++-objdump c++objdump cpp-objdump cxx-objdump creole cr feature cu cuh cy pyx pxd pxi d di d-objdump com dm zone arpa d darcspatch dpatch dart diff patch dockerfile djs dylan dyl intr lid E ecl eclxml ecl sch brd epj e ex exs elm el emacs em emberscript erl es escript hrl xrl yrl fs fsi fsx fx flux f90 f f03 f08 f77 f95 for fpp factor fy fancypack fan fs for fth 4th f for forth fr frt fs ftl fr g gco gcode gms g gap gd gi tst s ms gd glsl fp frag frg fs fsh fshader geo geom glslv gshader shader vert vrx vsh vshader gml kid ebuild eclass po pot glf gp gnu gnuplot plot plt go golo gs gst gsx vark grace gradle gf gml graphql dot gv man 1 1in 1m 1x 2 3 3in 3m 3qt 3x 4 5 6 7 8 9 l me ms n rno roff groovy grt gtpl gvy gsp hcl tf hlsl fx fxh hlsli html htm inc st xht xhtml mustache jinja eex erb phtml http hh php haml handlebars hbs hb hs hsc hx hxsl hy bf pro dlm ipf ini cfg prefs pro properties irclog weechatlog idr lidr ni i7x iss io ik thy ijs flex jflex json geojson lock topojson json5 jsonld jq jsx jade j java jsp js _js bones es es6 frag gs jake jsb jscad jsfl jsm jss njs pac sjs ssjs sublime-build sublime-commands sublime-completions sublime-keymap sublime-macro sublime-menu sublime-mousemap sublime-project sublime-settings sublime-theme sublime-workspace sublime_metrics sublime_session xsjs xsjslib jl ipynb krl sch brd kicad_pcb kit kt ktm kts lfe ll lol lsl lslp lvproj lasso las lasso8 lasso9 ldml latte lean hlean less l lex ly ily b m ld lds mod liquid lagda litcoffee lhs ls _ls xm x xi lgt logtalk lookml ls lua fcgi nse pd_lua rbxs wlua mumps m m4 m4 ms mcr mtml muf m mak d mk mkfile mako mao md markdown mkd mkdn mkdown ron mask mathematica cdf m ma mt nb nbp wl wlt matlab m maxpat maxhelp maxproj mxt pat mediawiki wiki m moo metal minid druby duby mir mirah mo mod mms mmk monkey moo moon myt ncl nl nsi nsh n axs axi nlogo nl lisp lsp nginxconf vhost nim nimrod ninja nit nix nu numpy numpyw numsc ml eliom eliomi ml4 mli mll mly objdump m h mm j sj omgrofl opa opal cl opencl p cls scad org ox oxh oxo oxygene oz pwn inc php aw ctp fcgi inc php3 php4 php5 phps phpt pls pck pkb pks plb plsql sql sql pov inc pan psc parrot pasm pir pas dfm dpr inc lpr pp pl al cgi fcgi perl ph plx pm pod psgi t 6pl 6pm nqp p6 p6l p6m pl pl6 pm pm6 t pkl l pig pike pmod pod pogo pony ps eps ps1 psd1 psm1 pde pl pro prolog yap spin proto asc pub pp pd pb pbi purs py bzl cgi fcgi gyp lmi pyde pyp pyt pyw rpy tac wsgi xpy pytb qml qbs pro pri r rd rsx raml rdoc rbbas rbfrm rbmnu rbres rbtbar rbuistate rhtml rmd rkt rktd rktl scrbl rl raw reb r r2 r3 rebol red reds cw rpy rs rsh robot rg rb builder fcgi gemspec god irbrc jbuilder mspec pluginspec podspec rabl rake rbuild rbw rbx ru ruby thor watchr rs sas scss smt2 smt sparql rq sqf hqf sql cql ddl inc prc tab udf viw sql db2 ston svg sage sagews sls sass scala sbt sc scaml scm sld sls sps ss sci sce tst self sh bash bats cgi command fcgi ksh tmux tool zsh sh-session shen sl slim smali st cs tpl sp inc sma nut stan ML fun sig sml do ado doh ihlp mata matah sthlp styl sc scd swift sv svh vh toml txl tcl adp tm tcsh csh tex aux bbx bib cbx cls dtx ins lbx ltx mkii mkiv mkvi sty toc tea t txt fr nb ncl no textile thrift t tu ttl twig ts tsx upc anim asset mat meta prefab unity uno uc ur urs vcl vhdl vhd vhf vhi vho vhs vht vhw vala vapi v veo vim vb bas cls frm frx vba vbhtml vbs volt vue owl webidl x10 xc xml ant axml ccxml clixml cproject csl csproj ct dita ditamap ditaval dotsettings filters fsproj fxml glade gml grxml iml ivy jelly jsproj kml launch mdpolicy mm mod mxml nproj nuspec odd osm plist pluginspec props ps1xml psc1 pt rdf rss scxml srdf storyboard stTheme sublime-snippet targets tmCommand tml tmLanguage tmPreferences tmSnippet tmTheme ts tsx ui urdf ux vbproj vcxproj vssettings vxml wsdl wsf wxi wxl wxs x3d xacro xaml xib xlf xliff xmi xproj xsd xul zcml xsp-config xpl xproc xquery xq xql xqm xqy xs xslt xsl xojo_code xojo_menu xojo_report xojo_script xojo_toolbar xojo_window xtend yml reek rviz sublime-syntax syntax yaml yaml-tmlanguage yang y yacc yy zep zimpl zmpl zpl desktop ec eh edn fish mu nc ooc rst rest wisp prg ch prw`.split(
                " "
              );

            let imgExts =
              `ase art bmp blp cd5 cit cpt cr2 cut dds dib djvu egt exif gif gpl grf icns ico iff jng jpeg jpg jfif jp2 jps lbm max miff mng msp nef nitf ota pbm pc1 pc2 pc3 pcf pcx pdn pgm PI1 PI2 PI3 pict pct pnm pns ppm psb psd pdd psp px pxm pxr qfx raw rle sct sgi rgb int bw tga tiff tif vtf xbm xcf xpm 3dv amf ai awg cgm cdr cmx dxf e2d egt eps fs gbr odg svg stl vrml x3d sxd v2d vnd wmf emf art xar png webp jxr hdp wdp cur ecw iff lbm liff nrrd pam pcx pgf sgi rgb rgba bw int inta sid ras sun tga heic heif`.split(
                " "
              );

            let fontExts =
              `jfproj vlw fnt pfa etx woff fot pfb sfd ttf vfb woff2 otf gxf odttf pmt glif bf ttc chr fon bdf pfm bmfc fnt amfm mf compositefont pf2 gdr abf gf pcf vnf sfp mxf dfont pfr tfm xfn ufo afm tte xft eot acfm pk suit ffil nftr euf txf mcf cha t65 lwfn ytf f3f fea pft sft`.split(
                " "
              );

            let videoExts =
              `webm mkv flv vob ogv ogg rrc gifv mng mov avi qt wmv yuv rm asf amv mp4 m4p m4v mpg mp2 mpeg mpe mpv m4v svi 3gp 3g2 mxf roq nsv flv f4v f4p f4a f4b mod`.split(
                " "
              );

            let audioExts =
              `3gp aa aac aax act aiff alac amr ape au awb dss dvf flac gsm iklax ivs m4a m4b m4p mmf mp3 mpc msv nmf ogg oga mogg opus ra rm rf64 sln tta voc vox wav wma wv web, 8svx cda`.split(
                " "
              );

            if (audioExts.includes(ext)) iconName = " music_note ";
            if (videoExts.includes(ext)) iconName = " movie ";
            if (codeLangs.includes(ext)) iconName = " code ";
            if (imgExts.includes(ext)) iconName = " image ";
            if (fontExts.includes(ext)) iconName = " text_fields ";
            if (ext == "json") iconName = " data_object ";
            if (ext == "html") iconName = "html";
            if (ext == "js") iconName = "javascript";
            if (ext == "php") iconName = "php";
            if (ext == "css") iconName = "css";
            if (ext == "html") iconName = "code";
            if (ext == "txt") iconName = " description ";
            if (ext == "gif") iconName = " gif ";
          }
          cfd = createFileDiv(d.name, iconName);
        } else if (d.type.startsWith("slk")) {
          cfd = createFileDiv(d.name, " link ");
        } else {
          cfd = createFileDiv(d.name, " question_mark ");
        }

        cfd.addEventListener("click", () => {
          file_c = 1;
          if (file_selected != -1) {
            if (file_selected == i) {
              if (new Date().getTime() - last_file_click < 300) {
                if (d.type == "dir") {
                  path += d.name + "/";
                  ABPath.forward(driveSelected, path);
                  lsAndShow();
                  return;
                } else if (d.type.includes("slk")) {
                  let t = d.type.replace("slk__", "");
                  if (t.startsWith("dir")) {
                    t = t.replace("dir__", "");
                    path = t;
                    ABPath.forward(driveSelected, path);
                    lsAndShow();
                    return;
                  } else {
                    t = t.replace("fil__", "");
                  }
                  return;
                }
              }
            }

            if (files.childElementCount > file_selected)
              files.children[file_selected].className = "";
            file_selected = -1;
          }
          if (file_selected == -1) {
            file_selected = i;
            cfd.className = "driveSelected";
            last_file_click = new Date().getTime();
          }
        });

        files.append(cfd);
      });
    });
}

export function sessionGenerateDone() {
  axios
    .get("/api/files/drives/get", {
      headers: {
        Authorization: sessionStorage.getItem("SessionKey"),
      },
    })
    .then((v) => {
      let d = v.data;

      if (d.e) {
        alert(`Critical error! ${d.e}`);
        return;
      }

      d = d as allowedPath[];

      driveCounts = d.length;

      for (let i = 0; i < d.length; i++) {
        let name = d[i].pathD.trim();
        drives_paths.push(d[i].pathD);

        if (name == "/") name = "root directory";
        if (name == "~/") name = "user directory";

        let ns = name.split("/");
        if (ns.length > 2) {
          name = "" + ns[ns.length - 1];
        }

        let drive_ = createFileDiv(name);

        if (i == 0) drive_.className = "driveSelected";

        drive_.addEventListener("click", () => {
          if (driveSelected == i && path == "") return;
          drives.children[driveSelected + 1].className = "";
          driveSelected = i;
          drive_.className = "driveSelected";
          path = "";
          ABPath.forward(driveSelected, path);
          lsAndShow();
        });

        drives.append(drive_);
      }

      lsAndShow();
    });
}
