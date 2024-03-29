type P = {
  id: string
}

export default function Test(prop: P) {
  
  return (
      <div>
        { prop.id }
      </div>
  );
}