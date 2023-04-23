import {expect, describe, test} from "vitest";
import {createLineStartsFast, createUintArray} from "vs/editor/common/model/pieceTreeTextBuffer/pieceTreeBase"


function getLineStarts(str: string): number[] {
  const lineStarts: number[] = [0]
  const _regex = new RegExp(/\r\n|\r|\n/g)
  _regex.lastIndex = 0
  let prevMatchStartIndex = -1
  let prevMatchLength = 0
  let match: RegExpExecArray | null
  do {
    if (prevMatchStartIndex + prevMatchLength === str.length) {
      break
    }
    match = _regex.exec(str)
    if (!match) {
      break
    }
    const matchStartIndex = match.index
    const matchLength = match[0].length

    if (prevMatchStartIndex === matchStartIndex && prevMatchLength === matchLength) {
      // This is a zero-length match
      break
    }

    prevMatchLength = matchLength
    prevMatchStartIndex = matchStartIndex

    lineStarts.push(matchStartIndex + matchLength)
  } while (match)
  return lineStarts
}

describe('create line start', () => {
  test('generate line starts', () => {
    const str = `\r, abc,\n, abc, \r\nhh, some more text\r\n, \t, hello world\n, even more text\n`
    const lineStartsFast = createLineStartsFast(str)
    console.log(lineStartsFast)
    const lineStarts = getLineStarts(str)
    expect(lineStartsFast).toStrictEqual(createUintArray(lineStarts))
  })
})
