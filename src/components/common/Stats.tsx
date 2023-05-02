type Props = {
  title: string;
  value: string;
  className?: string;
};

export default function Stats({ title, value, className }: Props) {
  return (
    <div className={`flex flex-col tracking-normal ${className}`}>
      <span className="text-sm font-medium text-gray-200">{title}</span>
      <span className="font-bold text-xl text-orange-200">{value}</span>
    </div>
  );
}
