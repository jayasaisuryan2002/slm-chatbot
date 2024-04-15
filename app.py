from flask import Flask, request, jsonify
from flask_cors import CORS
import os, PyPDF2, torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from datetime import datetime
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_text_splitters import CharacterTextSplitter
from langchain_community.vectorstores import FAISS
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM
from transformers import pipeline
from langchain_community.embeddings import SentenceTransformerEmbeddings, HuggingFaceEmbeddings
from langchain_community.llms import HuggingFacePipeline
from langchain.chains import RetrievalQA
from langchain.chains import ConversationalRetrievalChain
from langchain_community.document_loaders import TextLoader,  PyPDFLoader, DirectoryLoader, PDFMinerLoader
from langchain_community.vectorstores import FAISS
import lamini_retrieve

global PDF_DIRECTORY, DB_DIRECTORY
PDF_DIRECTORY = 'pdf_folder'
DB_DIRECTORY = 'faiss_folder'
os.environ["HF_TOKEN"] = "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"
os.environ['KMP_DUPLICATE_LIB_OK']='True'
 
app = Flask(__name__)
CORS(app)
 



@app.route('/', methods=['POST','GET'])
def system_check():
    global tokenizer, model
    if not os.path.exists(DB_DIRECTORY):
        os.makedirs(DB_DIRECTORY)
    if not os.path.exists(PDF_DIRECTORY):
        os.makedirs(PDF_DIRECTORY)
    #tokenizer = AutoTokenizer.from_pretrained("google/gemma-2b-it")
    #model = AutoModelForCausalLM.from_pretrained("google/gemma-2b-it")
    return jsonify({"status":200, "message":"System is up and running"})
 
@app.route('/update_db', methods=['POST'])
def update_db():
    file_list = request.files.getlist('files')
    #try:
    if not os.path.isdir(PDF_DIRECTORY):
        os.makedirs(PDF_DIRECTORY, exist_ok=True)
    print(PDF_DIRECTORY)
    for file in file_list:
        if file.filename not in os.listdir(PDF_DIRECTORY):
            file.save(os.path.join(PDF_DIRECTORY, file.filename))
        else:
            continue
    pdf_files = os.listdir(PDF_DIRECTORY)
    for pdf_file in pdf_files:
        extracted_text = pdf_to_text_converter(os.path.join(PDF_DIRECTORY, pdf_file))
        with open(os.path.join(DB_DIRECTORY, pdf_file.replace('.pdf','.txt')), 'w', encoding="utf-8") as file:
            file.write(extracted_text)
            file.close()
    os.environ["OPENAI_API_KEY"] = "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"
    update_faiss_df(DB_DIRECTORY)
    return jsonify({"status":200, "message":"DB updated successfully"})
    # except Exception as e:
    #     print(e)
    #     return jsonify({"status":500, "message":str(e)})
 
 
       
@app.route('/respond-la-mini', methods=['POST'])
def respond_la_mini():
    query = request.form.get('query')
    print(query)
    print(type(query))
    str_time = datetime.now()
    print("Start time: ", str_time)
    response = lamini_retrieve.qa_llm(query,index_loc="faiss_index")
    end_time = datetime.now()
    print("End time: ", end_time)
    return jsonify({"status":200, "chain_response":response})
    # except Exception as e:
    #     return jsonify({"status":500, "response":str(e)})  
 
def pdf_to_text_converter(file_path):
    text = ""
    with open(file_path, 'rb') as file:
        pdf = PyPDF2.PdfReader(file)
        for page_num in range(0,len(pdf.pages)):
            page = pdf.pages[page_num]
            text_bytes = page.extract_text().encode("utf-8")
            text_to_concat = text_bytes.decode("utf-8")
            text_to_concat = text_to_concat.replace("\n"," ").replace("\t"," ").replace("\r"," ")
            text = text + clean_data(text_to_concat) + "\n\n"
    return text
 
def update_faiss_df(directory):
    loader = DirectoryLoader(directory)
    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=300, chunk_overlap=50, separators = ["\n\n",".\n"])
    docs = text_splitter.split_documents(documents)
    model_kwargs = {"device": "cpu"}
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2", model_kwargs=model_kwargs)
    db = FAISS.from_documents(docs, embeddings)
    db.save_local("faiss_index")
 
def clean_data(string):
    return string.replace("\n"," ").replace("\t"," ").replace("\r"," ")
 
 
 
if __name__ == '__main__':
    app.run(debug=True, port=5000)