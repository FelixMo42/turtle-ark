const ASK = "ask"
const RES = "res"
const OPT = "opt"

"".replace

async function readPart(name) {
    console.log(">", name.trim())
    return fetch(`./parts/${name.trim().replaceAll(" ", "/")}`).then(res => res.text())
}

function makeEl(className, opts={}) {
    const el = document.createElement("div")

    el.className = className

    if (opts.text) {
        el.innerText = opts.text
    }

    if (opts.onclick) {
        el.onclick = opts.onclick
    }

    return el
}

async function parsePart(name) {
    return (await readPart(name))
        .split("\n\n")
        .map((block, i) => {
            if (block.startsWith(">")) {
                return [
                    OPT, block.split("\n").map(opt => opt
                        .substr(2)
                        .split(">")
                        .map(txt => txt.trim())
                    )
                ]
            } else {
                return [i % 2 ? RES : ASK, block]
            }
        })
}

function doPart(name) {
    return new Promise(async (resolve) => {
        document.querySelector("#part").replaceChildren(
            ...(await parsePart(name)).flatMap(([kind, body]) => {
                if (kind === OPT) {
                    return body.map(([text, part]) => makeEl(kind, {
                        text,
                        onclick: () => resolve(part)
                    }))
                } else {
                    return [ makeEl(kind, { text: body }) ]
                }
            })
        )
    })
}

async function main() {
    const params = new URLSearchParams(window.location.search);

    let part = params.get("part") || "intro"

    while (true) {
        part = await doPart(part)
    }
}

main()