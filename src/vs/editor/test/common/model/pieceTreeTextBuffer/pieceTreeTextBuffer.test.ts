import {expect, describe, test} from "vitest";
import {Position} from "vs/editor/common/core/position";
import {DefaultEndOfLine} from "vs/editor/common/model";
import {PieceTreeBase} from "vs/editor/common/model/pieceTreeTextBuffer/pieceTreeBase";
import {PieceTreeTextBuffer} from "vs/editor/common/model/pieceTreeTextBuffer/pieceTreeTextBuffer";
import {PieceTreeTextBufferBuilder} from "vs/editor/common/model/pieceTreeTextBuffer/pieceTreeTextBufferBuilder";
import {NodeColor, SENTINEL, TreeNode} from "vs/editor/common/model/pieceTreeTextBuffer/rbTreeBase";


function createTextBuffer(val: string[], normalizeEOL: boolean = true) {
  const bufferBuilder = new PieceTreeTextBufferBuilder();
  for (const chunk of val) {
    bufferBuilder.acceptChunk(chunk);
  }

  const factory = bufferBuilder.finish(normalizeEOL);
  return (<PieceTreeTextBuffer>factory.create(DefaultEndOfLine.LF).textBuffer).getPieceTree();
}

function depth(n: TreeNode): number {
  if (n === SENTINEL) {
    return 1
  }
  expect(depth(n.left)).toEqual(depth(n.right))
  return (n.color === NodeColor.Black ? 1 : 0) + depth(n.left)
}


function assertValidNode(n: TreeNode): { size: number; lf_cnt: number } {
  if (n === SENTINEL) {
    return {size: 0, lf_cnt: 0}
  }
  const l = n.left
  const r = n.right

  if (n.color === NodeColor.Red) {
    expect(l.color).toEqual(NodeColor.Black)
    expect(r.color).toEqual(NodeColor.Black)
  }

  const actualLeft = assertValidNode(l)
  expect(actualLeft?.lf_cnt).toEqual(n.lf_left)
  expect(actualLeft?.size).toEqual(n.size_left)

  const actualRight = assertValidNode(r)
  return {
    size: n.size_left + n.piece.length + actualRight.size,
    lf_cnt: n.lf_left + n.piece.lineFeedCnt + actualRight.lf_cnt
  }
}

function assertValidTree(T: PieceTreeBase) {
  if (T.root === SENTINEL) {
    return
  }
  expect(T.root.color).toEqual(NodeColor.Black)
  expect(depth(T.root.left)).toEqual(depth(T.root.right))
  assertValidNode(T.root)
}


function assertTreeInvariants(T: PieceTreeBase): void {

  // expect(SENTINEL.color).toEqual(NodeColor.Black)
  // assert(SENTINEL.parent === SENTINEL);
  // expect(SENTINEL.parent).toEqual(SENTINEL)
  // expect(SENTINEL.left).toEqual(SENTINEL)
  // expect(SENTINEL.right).toEqual(SENTINEL)
  // expect(SENTINEL.lf_left).toEqual(0)
  // expect(SENTINEL.size_left).toEqual(0)
  assertValidTree(T);
}

describe("inserts and deletes", () => {
  test("basic insert/delete", () => {
    const pieceTable = createTextBuffer([
      "This is a document with some text."
    ])

    pieceTable.insert(34, "This is some more text to insert at offset 34.")
    expect(pieceTable.getLinesRawContent()).toStrictEqual(
      "This is a document with some text.This is some more text to insert at offset 34."
    )

    pieceTable.delete(42, 5)
    expect(pieceTable.getLinesRawContent()).toStrictEqual(
      "This is a document with some text.This is more text to insert at offset 34."
    )

    assertTreeInvariants(pieceTable)
  })

  test("more inserts", () => {
    const pt = createTextBuffer([''])
    pt.insert(0, 'AAA')
    expect(pt.getLinesRawContent()).toStrictEqual('AAA')
    pt.insert(0, 'BBB')
    expect(pt.getLinesRawContent()).toStrictEqual('BBBAAA')
    pt.insert(6, 'CCC');
    expect(pt.getLinesRawContent()).toStrictEqual('BBBAAACCC')
    pt.insert(5, 'DDD');
    expect(pt.getLinesRawContent()).toStrictEqual('BBBAADDDACCC')
    assertTreeInvariants(pt);
  })

  test("more deletes", () => {
    const pt = createTextBuffer(['012345678'])
    pt.delete(8, 1)
    expect(pt.getLinesRawContent()).toStrictEqual('01234567')
    pt.delete(0, 1)
    expect(pt.getLinesRawContent()).toStrictEqual('1234567')
    pt.delete(5, 1)
    expect(pt.getLinesRawContent()).toStrictEqual('123457')
    pt.delete(5, 1)
    expect(pt.getLinesRawContent()).toStrictEqual('12345')
    pt.delete(0, 5)
    expect(pt.getLinesRawContent()).toStrictEqual('')
    assertTreeInvariants(pt)
  })

  test('random test 1', () => {
    let str = '';
    const pieceTable = createTextBuffer(['']);
    pieceTable.insert(0, 'ceLPHmFzvCtFeHkCBej ');
    str = str.substring(0, 0) + 'ceLPHmFzvCtFeHkCBej ' + str.substring(0);
    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)
    pieceTable.insert(8, 'gDCEfNYiBUNkSwtvB K ');
    str = str.substring(0, 8) + 'gDCEfNYiBUNkSwtvB K ' + str.substring(8);
    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)
    pieceTable.insert(38, 'cyNcHxjNPPoehBJldLS ');
    str = str.substring(0, 38) + 'cyNcHxjNPPoehBJldLS ' + str.substring(38);
    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)
    pieceTable.insert(59, 'ejMx\nOTgWlbpeDExjOk ');
    str = str.substring(0, 59) + 'ejMx\nOTgWlbpeDExjOk ' + str.substring(59);

    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)
    assertTreeInvariants(pieceTable);
  });

  test('random test 2', () => {
    let str = '';
    const pieceTable = createTextBuffer(['']);
    pieceTable.insert(0, 'VgPG ');
    str = str.substring(0, 0) + 'VgPG ' + str.substring(0);
    pieceTable.insert(2, 'DdWF ');
    str = str.substring(0, 2) + 'DdWF ' + str.substring(2);
    pieceTable.insert(0, 'hUJc ');
    str = str.substring(0, 0) + 'hUJc ' + str.substring(0);
    pieceTable.insert(8, 'lQEq ');
    str = str.substring(0, 8) + 'lQEq ' + str.substring(8);
    pieceTable.insert(10, 'Gbtp ');
    str = str.substring(0, 10) + 'Gbtp ' + str.substring(10);

    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)
    assertTreeInvariants(pieceTable);
  });

  test('random test 3', () => {
    let str = '';
    const pieceTable = createTextBuffer(['']);
    pieceTable.insert(0, 'gYSz');
    str = str.substring(0, 0) + 'gYSz' + str.substring(0);
    pieceTable.insert(1, 'mDQe');
    str = str.substring(0, 1) + 'mDQe' + str.substring(1);
    pieceTable.insert(1, 'DTMQ');
    str = str.substring(0, 1) + 'DTMQ' + str.substring(1);
    pieceTable.insert(2, 'GGZB');
    str = str.substring(0, 2) + 'GGZB' + str.substring(2);
    pieceTable.insert(12, 'wXpq');
    str = str.substring(0, 12) + 'wXpq' + str.substring(12);
    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)
  });

  test('random delete 1', () => {
    let str = '';
    const pieceTable = createTextBuffer(['']);

    pieceTable.insert(0, 'vfb');
    str = str.substring(0, 0) + 'vfb' + str.substring(0);
    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)
    pieceTable.insert(0, 'zRq');
    str = str.substring(0, 0) + 'zRq' + str.substring(0);
    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)

    pieceTable.delete(5, 1);
    str = str.substring(0, 5) + str.substring(5 + 1);
    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)

    pieceTable.insert(1, 'UNw');
    str = str.substring(0, 1) + 'UNw' + str.substring(1);
    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)

    pieceTable.delete(4, 3);
    str = str.substring(0, 4) + str.substring(4 + 3);
    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)

    pieceTable.delete(1, 4);
    str = str.substring(0, 1) + str.substring(1 + 4);
    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)

    pieceTable.delete(0, 1);
    str = str.substring(0, 0) + str.substring(0 + 1);
    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)
    assertTreeInvariants(pieceTable);
  });

  test('random delete 2', () => {
    let str = '';
    const pieceTable = createTextBuffer(['']);

    pieceTable.insert(0, 'IDT');
    str = str.substring(0, 0) + 'IDT' + str.substring(0);
    pieceTable.insert(3, 'wwA');
    str = str.substring(0, 3) + 'wwA' + str.substring(3);
    pieceTable.insert(3, 'Gnr');
    str = str.substring(0, 3) + 'Gnr' + str.substring(3);
    pieceTable.delete(6, 3);
    str = str.substring(0, 6) + str.substring(6 + 3);
    pieceTable.insert(4, 'eHp');
    str = str.substring(0, 4) + 'eHp' + str.substring(4);
    pieceTable.insert(1, 'UAi');
    str = str.substring(0, 1) + 'UAi' + str.substring(1);
    pieceTable.insert(2, 'FrR');
    str = str.substring(0, 2) + 'FrR' + str.substring(2);
    pieceTable.delete(6, 7);
    str = str.substring(0, 6) + str.substring(6 + 7);
    pieceTable.delete(3, 5);
    str = str.substring(0, 3) + str.substring(3 + 5);
    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)
    assertTreeInvariants(pieceTable);
  });

  test('random delete 3', () => {
    let str = '';
    const pieceTable = createTextBuffer(['']);
    pieceTable.insert(0, 'PqM');
    str = str.substring(0, 0) + 'PqM' + str.substring(0);
    pieceTable.delete(1, 2);
    str = str.substring(0, 1) + str.substring(1 + 2);
    pieceTable.insert(1, 'zLc');
    str = str.substring(0, 1) + 'zLc' + str.substring(1);
    pieceTable.insert(0, 'MEX');
    str = str.substring(0, 0) + 'MEX' + str.substring(0);
    pieceTable.insert(0, 'jZh');
    str = str.substring(0, 0) + 'jZh' + str.substring(0);
    pieceTable.insert(8, 'GwQ');
    str = str.substring(0, 8) + 'GwQ' + str.substring(8);
    pieceTable.delete(5, 6);
    str = str.substring(0, 5) + str.substring(5 + 6);
    pieceTable.insert(4, 'ktw');
    str = str.substring(0, 4) + 'ktw' + str.substring(4);
    pieceTable.insert(5, 'GVu');
    str = str.substring(0, 5) + 'GVu' + str.substring(5);
    pieceTable.insert(9, 'jdm');
    str = str.substring(0, 9) + 'jdm' + str.substring(9);
    pieceTable.insert(15, 'na\n');
    str = str.substring(0, 15) + 'na\n' + str.substring(15);
    pieceTable.delete(5, 8);
    str = str.substring(0, 5) + str.substring(5 + 8);
    pieceTable.delete(3, 4);
    str = str.substring(0, 3) + str.substring(3 + 4);
    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)
    assertTreeInvariants(pieceTable);
  });

  test('random insert/delete \\r bug 1', () => {
    let str = 'a';
    const pieceTable = createTextBuffer(['a']);
    pieceTable.delete(0, 1);
    str = str.substring(0, 0) + str.substring(1);
    pieceTable.insert(0, '\r\r\n\n');
    str = str.substring(0, 0) + '\r\r\n\n' + str.substring(0);
    pieceTable.delete(3, 1);
    str = str.substring(0, 3) + str.substring(3 + 1);
    pieceTable.insert(2, '\n\n\ra');
    str = str.substring(0, 2) + '\n\n\ra' + str.substring(2);
    pieceTable.delete(4, 3);
    str = str.substring(0, 4) + str.substring(4 + 3);
    pieceTable.insert(2, '\na\r\r');
    str = str.substring(0, 2) + '\na\r\r' + str.substring(2);
    pieceTable.insert(6, '\ra\n\n');
    str = str.substring(0, 6) + '\ra\n\n' + str.substring(6);
    pieceTable.insert(0, 'aa\n\n');
    str = str.substring(0, 0) + 'aa\n\n' + str.substring(0);
    pieceTable.insert(5, '\n\na\r');
    str = str.substring(0, 5) + '\n\na\r' + str.substring(5);

    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)
    assertTreeInvariants(pieceTable);
  });

  test('random insert/delete \\r bug 2', () => {
    let str = 'a';
    const pieceTable = createTextBuffer(['a']);
    pieceTable.insert(1, '\naa\r');
    str = str.substring(0, 1) + '\naa\r' + str.substring(1);
    pieceTable.delete(0, 4);
    str = str.substring(0, 0) + str.substring(4);
    pieceTable.insert(1, '\r\r\na');
    str = str.substring(0, 1) + '\r\r\na' + str.substring(1);
    pieceTable.insert(2, '\n\r\ra');
    str = str.substring(0, 2) + '\n\r\ra' + str.substring(2);
    pieceTable.delete(4, 1);
    str = str.substring(0, 4) + str.substring(4 + 1);
    pieceTable.insert(8, '\r\n\r\r');
    str = str.substring(0, 8) + '\r\n\r\r' + str.substring(8);
    pieceTable.insert(7, '\n\n\na');
    str = str.substring(0, 7) + '\n\n\na' + str.substring(7);
    pieceTable.insert(13, 'a\n\na');
    str = str.substring(0, 13) + 'a\n\na' + str.substring(13);
    pieceTable.delete(17, 3);
    str = str.substring(0, 17) + str.substring(17 + 3);
    pieceTable.insert(2, 'a\ra\n');
    str = str.substring(0, 2) + 'a\ra\n' + str.substring(2);

    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)
    assertTreeInvariants(pieceTable);
  });

  test('random insert/delete \\r bug 3', () => {
    let str = 'a';
    const pieceTable = createTextBuffer(['a']);
    pieceTable.insert(0, '\r\na\r');
    str = str.substring(0, 0) + '\r\na\r' + str.substring(0);
    pieceTable.delete(2, 3);
    str = str.substring(0, 2) + str.substring(2 + 3);
    pieceTable.insert(2, 'a\r\n\r');
    str = str.substring(0, 2) + 'a\r\n\r' + str.substring(2);
    pieceTable.delete(4, 2);
    str = str.substring(0, 4) + str.substring(4 + 2);
    pieceTable.insert(4, 'a\n\r\n');
    str = str.substring(0, 4) + 'a\n\r\n' + str.substring(4);
    pieceTable.insert(1, 'aa\n\r');
    str = str.substring(0, 1) + 'aa\n\r' + str.substring(1);
    pieceTable.insert(7, '\na\r\n');
    str = str.substring(0, 7) + '\na\r\n' + str.substring(7);
    pieceTable.insert(5, '\n\na\r');
    str = str.substring(0, 5) + '\n\na\r' + str.substring(5);
    pieceTable.insert(10, '\r\r\n\r');
    str = str.substring(0, 10) + '\r\r\n\r' + str.substring(10);
    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)
    pieceTable.delete(21, 3);
    str = str.substring(0, 21) + str.substring(21 + 3);

    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)
    assertTreeInvariants(pieceTable);
  });

  test('random insert/delete \\r bug 4s', () => {
    let str = 'a';
    const pieceTable = createTextBuffer(['a']);
    pieceTable.delete(0, 1);
    str = str.substring(0, 0) + str.substring(1);
    pieceTable.insert(0, '\naaa');
    str = str.substring(0, 0) + '\naaa' + str.substring(0);
    pieceTable.insert(2, '\n\naa');
    str = str.substring(0, 2) + '\n\naa' + str.substring(2);
    pieceTable.delete(1, 4);
    str = str.substring(0, 1) + str.substring(1 + 4);
    pieceTable.delete(3, 1);
    str = str.substring(0, 3) + str.substring(3 + 1);
    pieceTable.delete(1, 2);
    str = str.substring(0, 1) + str.substring(1 + 2);
    pieceTable.delete(0, 1);
    str = str.substring(0, 0) + str.substring(1);
    pieceTable.insert(0, 'a\n\n\r');
    str = str.substring(0, 0) + 'a\n\n\r' + str.substring(0);
    pieceTable.insert(2, 'aa\r\n');
    str = str.substring(0, 2) + 'aa\r\n' + str.substring(2);
    pieceTable.insert(3, 'a\naa');
    str = str.substring(0, 3) + 'a\naa' + str.substring(3);

    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)
    assertTreeInvariants(pieceTable);
  });
  test('random insert/delete \\r bug 5', () => {
    let str = '';
    const pieceTable = createTextBuffer(['']);
    pieceTable.insert(0, '\n\n\n\r');
    str = str.substring(0, 0) + '\n\n\n\r' + str.substring(0);
    pieceTable.insert(1, '\n\n\n\r');
    str = str.substring(0, 1) + '\n\n\n\r' + str.substring(1);
    pieceTable.insert(2, '\n\r\r\r');
    str = str.substring(0, 2) + '\n\r\r\r' + str.substring(2);
    pieceTable.insert(8, '\n\r\n\r');
    str = str.substring(0, 8) + '\n\r\n\r' + str.substring(8);
    pieceTable.delete(5, 2);
    str = str.substring(0, 5) + str.substring(5 + 2);
    pieceTable.insert(4, '\n\r\r\r');
    str = str.substring(0, 4) + '\n\r\r\r' + str.substring(4);
    pieceTable.insert(8, '\n\n\n\r');
    str = str.substring(0, 8) + '\n\n\n\r' + str.substring(8);
    pieceTable.delete(0, 7);
    str = str.substring(0, 0) + str.substring(7);
    pieceTable.insert(1, '\r\n\r\r');
    str = str.substring(0, 1) + '\r\n\r\r' + str.substring(1);
    pieceTable.insert(15, '\n\r\r\r');
    str = str.substring(0, 15) + '\n\r\r\r' + str.substring(15);

    expect(pieceTable.getLinesRawContent()).toStrictEqual(str)
    assertTreeInvariants(pieceTable);
  });

})

describe("prefix sum for line feed", () => {
  test("basic", () => {
    const pieceTable = createTextBuffer(["1\n2\n3\n4"])
    expect(pieceTable.getLineCount()).toStrictEqual(4)
    expect(pieceTable.getPositionAt(0)).toStrictEqual(new Position(1, 1))
    expect(pieceTable.getPositionAt(1)).toStrictEqual(new Position(1, 2))
    expect(pieceTable.getPositionAt(2)).toStrictEqual(new Position(2, 1))
    expect(pieceTable.getPositionAt(3)).toStrictEqual(new Position(2, 2))
    expect(pieceTable.getPositionAt(4)).toStrictEqual(new Position(3, 1))
    expect(pieceTable.getPositionAt(5)).toStrictEqual(new Position(3, 2))
    expect(pieceTable.getPositionAt(6)).toStrictEqual(new Position(4, 1))

    expect(pieceTable.getOffsetAt(1, 1)).toStrictEqual(0)
    expect(pieceTable.getOffsetAt(1, 2)).toStrictEqual(1)
    expect(pieceTable.getOffsetAt(2, 1)).toStrictEqual(2)
    expect(pieceTable.getOffsetAt(2, 2)).toStrictEqual(3)
    expect(pieceTable.getOffsetAt(3, 1)).toStrictEqual(4)
    expect(pieceTable.getOffsetAt(3, 2)).toStrictEqual(5)
    expect(pieceTable.getOffsetAt(4, 1)).toStrictEqual(6)
    assertTreeInvariants(pieceTable)
  })


})
