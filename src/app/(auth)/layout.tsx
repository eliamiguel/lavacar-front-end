function Form({ children }: { children: React.ReactNode }) {
  return (
    <main 
      style={{ backgroundImage: `url('/images/fundo.jpg')` }} 
      className="bg-cover bg-center relative  flex items-center justify-center"
    >
      <div className="w-full h-full flex items-center justify-center bg-black bg-opacity-50">
        <div className="w-full max-w-4xl p-8 rounded-lg shadow-lg">
          {children}
        </div>
      </div>
    </main>
  );
}

export default Form;
