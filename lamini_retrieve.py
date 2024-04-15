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


def qa_llm(input_query,index_loc):
    print(input_query)
    checkpoint = "MBZUAI/LaMini-Flan-T5-783M"
    tokenizer = AutoTokenizer.from_pretrained(checkpoint)
    base_model = AutoModelForSeq2SeqLM.from_pretrained(checkpoint, device_map='auto', torch_dtype=torch.float32)
    model = pipeline('text2text-generation', max_new_tokens=512, model = checkpoint)
    llm = HuggingFacePipeline(pipeline=model)
    # os.path.join(DB_DIRECTORY,"faiss_index")
    model_kwargs = {"device": "cpu"}
    embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2", model_kwargs=model_kwargs)
    db = FAISS.load_local(index_loc,embeddings,allow_dangerous_deserialization=True)
    retriever = db.as_retriever()
    chain = ConversationalRetrievalChain.from_llm(llm, retriever, return_source_documents=True)
    chat_history = []
    query = f"Properly Answer the given question as much as you can by understanding/using the given data. Question: {input_query}"
    result = chain({"question": query, "chat_history": chat_history} )
    print("Using Chain<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    print("result['answer']: ",result['answer'])
    print("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
    print("------------------------------------------------------\n")
    print("result: ",result)
    del model
    del llm
    del db
    del embeddings
    del chain
    return result['answer']