import asTag from '~/utils/as-tag';

test(`succeeds for undefined`, () => {
  expect(asTag(undefined as any)).toMatchInlineSnapshot(`""`);
});
test(`succeeds for string`, () => {
  expect(asTag('foo bar baz')).toMatchInlineSnapshot(`"foo bar baz"`);
});
test(`succeeds for string w/ placeholders`, () => {
  expect(asTag('foo bar baz' as any, 'bar')).toMatchInlineSnapshot(
    `"foo bar baz"`
  );
});
test(`succeeds for tag`, () => {
  expect(asTag`foo bar baz`).toMatchInlineSnapshot(`"foo bar baz"`);
  expect(asTag`${'foo'}bar${'baz'}foobar${'foobaz'}`).toMatchInlineSnapshot(
    `"foobarbazfoobarfoobaz"`
  );
});
