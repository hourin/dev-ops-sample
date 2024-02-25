use actix_web::{get, post, patch, delete, web, App, HttpRequest, HttpResponse, HttpServer, Responder};
use mysql::prelude::*;
use mysql::*;
use serde::{Deserialize, Serialize};

#[derive(Debug, PartialEq, Eq, Serialize, Deserialize)]
struct Memo {
    id: Option<i32>,
    title: String,
    memo: String,
}

impl Memo {
    fn from_row(row: mysql::Row) -> Memo {
        let (id, title, memo): (Option<i32>, String, String) = (
            row.get("ID").unwrap_or(None),
            row.get("TITLE").unwrap_or(String::new()),
            row.get("MEMO").unwrap_or(String::new()),
        );
        Memo { id, title, memo }
    }
}

#[get("/api/memos")]
async fn get_memos() -> impl Responder {
    let url = "mysql://ユーザー名:パスワード@ホスト名:3306/データベース名";
    let pool = Pool::new(url).unwrap();
    let mut conn = pool.get_conn().unwrap();

    let memos: Vec<Memo> = conn
        .query_map("SELECT ID, TITLE, MEMO FROM MEMOS", |row| Memo::from_row(row))
        .unwrap();

    HttpResponse::Ok().json(memos)
}

#[get("/api/memos/{id}")]
async fn get_memo_by_id(req: HttpRequest) -> impl Responder {
    let id: i32 = req.match_info().get("id").unwrap().parse().unwrap();
    let url = "mysql://ユーザー名:パスワード@ホスト名:3306/データベース名";
    let pool = Pool::new(url).unwrap();
    let mut conn = pool.get_conn().unwrap();

    let memo: Option<Memo> = conn
        .exec_first("SELECT ID, TITLE, MEMO FROM MEMOS WHERE ID = :id", params! { "id" => id })
        .unwrap_or(None)
        .map(|row| Memo::from_row(row));

    match memo {
        Some(memo) => HttpResponse::Ok().json(memo),
        None => HttpResponse::NotFound().body("Memo not found"),
    }
}


#[post("/api/memos")]
async fn create_memo(req_body: web::Json<Memo>) -> HttpResponse {
    let url = "mysql://ユーザー名:パスワード@ホスト名:3306/データベース名";
    let pool = Pool::new(url).unwrap();
    let mut conn = pool.get_conn().unwrap();

    let memo = req_body.into_inner();

    conn.exec_drop(
        "INSERT INTO MEMOS (TITLE, MEMO) VALUES (:title, :memo)",
        params! {
            "title" => memo.title,
            "memo" => memo.memo,
        },
    ).unwrap();

    HttpResponse::Created().finish()
}

#[patch("/api/memos/{id}")]
async fn update_memo(id: web::Path<i32>, req_body: web::Json<Memo>) -> HttpResponse {
    let memo_id = id.into_inner();
    let updated_memo = req_body.into_inner();

    let url = "mysql://ユーザー名:パスワード@ホスト名:3306/データベース名";
    let pool = Pool::new(url).unwrap();
    let mut conn = pool.get_conn().unwrap();

    conn.exec_drop(
        "UPDATE MEMOS SET TITLE = :title, MEMO = :memo WHERE ID = :id",
        params! {
            "id" => memo_id,
            "title" => updated_memo.title,
            "memo" => updated_memo.memo,
        },
    ).unwrap();

    HttpResponse::Ok().finish()
}

#[delete("/api/memos/{id}")]
async fn delete_memo(id: web::Path<i32>) -> HttpResponse {
    let memo_id = id.into_inner();

    let url = "mysql://ユーザー名:パスワード@ホスト名:3306/データベース名";
    let pool = Pool::new(url).unwrap();
    let mut conn = pool.get_conn().unwrap();

    conn.exec_drop(
        "DELETE FROM MEMOS WHERE ID = :id",
        params! {
            "id" => memo_id,
        },
    ).unwrap();

    HttpResponse::Ok().finish()
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new()
            .service(get_memos)
            .service(get_memo_by_id)
            .service(create_memo)
            .service(update_memo)
            .service(delete_memo)
        )
        .bind("0.0.0.0:8080")?
        .run()
        .await
}
