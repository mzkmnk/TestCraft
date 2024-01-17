export default function Watch({ time }) {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;

  return (
    <div>
      <div>
        {minutes}分{seconds}秒
      </div>
    </div>
  );
}
