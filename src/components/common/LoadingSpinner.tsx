import Image from "next/image";

type Props = {
  className?: string;
  size?: number;
};

export const LoadingSpinner = ({ size }: Props) => {
  return (
    <Image
      src="/assets/icons/spinner.png"
      alt=""
      className="loading-spinner-rotate"
      width={size || 24}
      height={size || 24}
    />
  );
};
