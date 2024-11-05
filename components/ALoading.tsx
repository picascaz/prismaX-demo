import classNames from 'classnames';
import React from 'react';
import { HTMLAttributes } from 'react';
import { RiLoader2Fill } from 'react-icons/ri';

function ALoading(p: { size?: string } & HTMLAttributes<HTMLDivElement>) {
  const { className, color, size = '', ...other } = p;
  return (
    <div {...other} className={classNames('text-black w-full h-full flex items-center justify-center', className)}>
      <RiLoader2Fill color={color} style={size ? { fontSize: size } : {}} className="text-[3.125rem] animate-spin" />
    </div>
  );
}

export default function LoadingFull() {
  return <ALoading className="fixed z-50 left-0 top-0 w-full !h-full bg-black/25" />;
}

