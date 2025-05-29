export function ChatUI() {
  return (
    <div className="flex-col flex-1 flex h-full justify-between">
      <div className="flex-1 p-4 overflow-y-auto text-sm bg-blue-300 text-gray-600">
        {/* Chat messages will go here */}
        <p></p>
      </div>
      <div>
        <form className="p-4 border-t bg-gray-100">
          <input
            type="text"
            placeholder="Type your message..."
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
