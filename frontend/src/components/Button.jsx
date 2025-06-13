export default function Button(props) {
  const { classnames, content } = props;

  return <button className={`btn ${classnames}`}>{content}</button>;
}