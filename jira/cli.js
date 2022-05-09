import c from "ansi-colors";

export const describeOpenTickets = (tickets) => {
  const result = tickets
    .map(({ number, summary, updated }) => `${c.whiteBright(number)} ${c.gray(`(${updated})`)}\n${summary}`)
    .join("\n\n");
    return `\n${result}\n`
};
