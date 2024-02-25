use actix_web::{get, App, HttpRequest, HttpResponse, HttpServer, Responder};
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

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| App::new()
            .service(get_memos)
        )
        .bind("0.0.0.0:8080")?
        .run()
        .await
}
